import { tool } from "ai";
import { z } from "zod";

export const renderChartTool = tool({
  description: "Generate a chart configuration from query results. Auto-selects the best chart type based on data shape. The chart renders on the client via Recharts.",
  parameters: z.object({
    title: z.string().describe("Chart title"),
    data: z.array(z.record(z.unknown())).describe("Array of data rows for the chart"),
    chartType: z.enum(["bar", "line", "area", "scatter", "pie", "donut", "table"])
      .optional()
      .describe("Chart type. If omitted, auto-selects based on data shape."),
    xAxis: z.string().optional().describe("Column for X axis"),
    yAxis: z.union([z.string(), z.array(z.string())]).optional().describe("Column(s) for Y axis"),
    groupBy: z.string().optional().describe("Column to group/color by"),
  }),
  execute: async ({ title, data, chartType, xAxis, yAxis, groupBy }) => {
    if (!data || data.length === 0) {
      return { error: "No data provided for chart" };
    }

    const columns = Object.keys(data[0]);

    // Auto-detect chart type if not specified
    let resolvedType = chartType;
    if (!resolvedType) {
      const numericCols = columns.filter((col) => {
        const sample = data.slice(0, 10).map((r) => r[col]);
        return sample.every((v) => typeof v === "number" || (!isNaN(Number(v)) && v !== null && v !== ""));
      });
      const stringCols = columns.filter((c) => !numericCols.includes(c));

      if (numericCols.length >= 2 && stringCols.length === 0) {
        resolvedType = "scatter";
      } else if (stringCols.length === 1 && numericCols.length === 1) {
        // Check if it looks like time series
        const firstVal = String(data[0][stringCols[0]]);
        if (/^\d{4}[-/]/.test(firstVal) || /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(firstVal)) {
          resolvedType = "line";
        } else if (data.length <= 8) {
          resolvedType = "pie";
        } else {
          resolvedType = "bar";
        }
      } else if (stringCols.length >= 1 && numericCols.length >= 1) {
        resolvedType = "bar";
      } else {
        resolvedType = "table";
      }
    }

    // Resolve axes
    const numericCols = columns.filter((col) => {
      const v = data[0][col];
      return typeof v === "number" || !isNaN(Number(v));
    });
    const stringCols = columns.filter((c) => !numericCols.includes(c));

    const resolvedX = xAxis || stringCols[0] || columns[0];
    const resolvedY = yAxis || (numericCols.length > 0 ? numericCols[0] : columns[1]);

    return {
      chartType: resolvedType,
      title,
      config: {
        xAxis: resolvedX,
        yAxis: resolvedY,
        groupBy,
        colors: ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#6366f1"],
      },
      data: data.slice(0, 10000),
      rowCount: data.length,
    };
  },
});
