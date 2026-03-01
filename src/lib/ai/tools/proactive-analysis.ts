import { tool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { eq } from "drizzle-orm";

export const proactiveAnalysisTool = tool({
  description: "Automatically analyze a data source to surface key insights: distributions, outliers, correlations, data quality issues, and chart suggestions. Call this when a new data source is first viewed or when the user asks for an overview.",
  parameters: z.object({
    dataSourceId: z.string().describe("The data source to analyze"),
  }),
  execute: async ({ dataSourceId }) => {
    try {
      const [ds] = await db
        .select()
        .from(dataSources)
        .where(eq(dataSources.id, dataSourceId));

      if (!ds) return { error: "Data source not found" };

      const schema = ds.schema as {
        columns?: { name: string; type: string; nullPercentage: number; sampleValues: unknown[] }[];
        rowCount?: number;
        previewRows?: Record<string, unknown>[];
      } | null;

      if (!schema?.columns) return { error: "Schema not available" };

      const rows = schema.previewRows || [];
      const insights: string[] = [];
      const chartSuggestions: { type: string; label: string; description: string }[] = [];

      // Data quality analysis
      const highNullCols = schema.columns.filter((c) => c.nullPercentage > 20);
      if (highNullCols.length > 0) {
        insights.push(
          `⚠️ Data quality: ${highNullCols.length} column(s) have >20% null values: ${highNullCols.map((c) => `${c.name} (${c.nullPercentage}%)`).join(", ")}`
        );
      }

      // Numeric column analysis
      const numericCols = schema.columns.filter((c) => c.type === "number");
      for (const col of numericCols.slice(0, 5)) {
        const values = rows.map((r) => Number(r[col.name])).filter((n) => !isNaN(n));
        if (values.length > 0) {
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);
          const range = max - min;

          // Outlier detection (simple IQR)
          const sorted = [...values].sort((a, b) => a - b);
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const iqr = q3 - q1;
          const outliers = values.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);

          if (outliers.length > 0) {
            insights.push(
              `📊 ${col.name}: Found ${outliers.length} potential outlier(s) (range: ${min.toLocaleString()} to ${max.toLocaleString()}, mean: ${mean.toFixed(1)})`
            );
          }

          insights.push(
            `📈 ${col.name}: avg=${mean.toFixed(1)}, min=${min.toLocaleString()}, max=${max.toLocaleString()}`
          );
        }
      }

      // Date column detection for time series
      const dateCols = schema.columns.filter((c) => c.type === "date");
      if (dateCols.length > 0 && numericCols.length > 0) {
        chartSuggestions.push({
          type: "line",
          label: "📈 Line trend",
          description: `${numericCols[0].name} over ${dateCols[0].name}`,
        });
      }

      // Category + value → bar chart
      const stringCols = schema.columns.filter((c) => c.type === "string");
      if (stringCols.length > 0 && numericCols.length > 0) {
        chartSuggestions.push({
          type: "bar",
          label: "📊 Bar chart",
          description: `${numericCols[0].name} by ${stringCols[0].name}`,
        });
      }

      // Distribution → histogram suggestion
      if (numericCols.length >= 1) {
        chartSuggestions.push({
          type: "bar",
          label: "📉 Distribution",
          description: `Distribution of ${numericCols[0].name}`,
        });
      }

      // Correlation suggestion for 2+ numeric cols
      if (numericCols.length >= 2) {
        chartSuggestions.push({
          type: "scatter",
          label: "🔵 Scatter plot",
          description: `${numericCols[0].name} vs ${numericCols[1].name}`,
        });
      }

      // Row count insight
      insights.unshift(
        `📋 Dataset: ${schema.rowCount?.toLocaleString() || rows.length} rows, ${schema.columns.length} columns (${numericCols.length} numeric, ${stringCols.length} text, ${dateCols.length} date)`
      );

      return {
        insights: insights.slice(0, 5),
        chartSuggestions: chartSuggestions.slice(0, 4),
        summary: {
          rowCount: schema.rowCount || rows.length,
          columnCount: schema.columns.length,
          numericColumns: numericCols.length,
          textColumns: stringCols.length,
          dateColumns: dateCols.length,
          highNullColumns: highNullCols.length,
        },
      };
    } catch (err) {
      return { error: `Analysis failed: ${(err as Error).message}` };
    }
  },
});
