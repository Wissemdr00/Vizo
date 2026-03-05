import { tool } from "../tool";
import { z } from "zod";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { eq } from "drizzle-orm";

export const profileDataTool = tool({
  description: "Profile a data source: get statistical summaries including distributions, null rates, unique counts, and basic stats per column.",
  parameters: z.object({
    dataSourceId: z.string().describe("The data source to profile"),
    columns: z.array(z.string()).optional().describe("Specific columns to profile. If empty, profiles all."),
  }),
  execute: async ({ dataSourceId, columns }) => {
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

      const targetCols = columns?.length
        ? schema.columns.filter((c) => columns.includes(c.name))
        : schema.columns;

      // Compute profiling from preview rows if available
      const rows = schema.previewRows || [];
      const profile = targetCols.map((col) => {
        const values = rows.map((r) => r[col.name]).filter((v) => v != null);
        const uniqueCount = new Set(values.map(String)).size;

        const stats: Record<string, unknown> = {
          name: col.name,
          type: col.type,
          nullPercentage: col.nullPercentage,
          uniqueCount,
          sampleValues: col.sampleValues?.slice(0, 3),
          totalRows: schema.rowCount || rows.length,
        };

        // Numeric stats
        if (col.type === "number") {
          const nums = values.map(Number).filter((n) => !isNaN(n));
          if (nums.length > 0) {
            nums.sort((a, b) => a - b);
            stats.min = nums[0];
            stats.max = nums[nums.length - 1];
            stats.mean = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
            stats.median = nums[Math.floor(nums.length / 2)];
          }
        }

        return stats;
      });

      return { columns: profile, rowCount: schema.rowCount };
    } catch (err) {
      return { error: `Profiling failed: ${(err as Error).message}` };
    }
  },
});
