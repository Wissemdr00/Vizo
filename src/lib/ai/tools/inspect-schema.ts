import { tool } from "../tool";
import { z } from "zod";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { eq } from "drizzle-orm";

export const inspectSchemaTool = tool({
  description: "Inspect the schema of a data source. Returns column names, types, sample values, and row counts. Call this before writing any queries.",
  parameters: z.object({
    dataSourceId: z.string().describe("The ID of the data source to inspect"),
  }),
  execute: async ({ dataSourceId }) => {
    try {
      const [ds] = await db
        .select()
        .from(dataSources)
        .where(eq(dataSources.id, dataSourceId));

      if (!ds) {
        return { error: "Data source not found" };
      }

      const schema = ds.schema as Record<string, unknown> | null;
      if (!schema) {
        return { error: "Schema not available. Data source may still be processing." };
      }

      // Return schema without preview rows (too large for context)
      const { previewRows, ...schemaWithoutPreview } = schema as Record<string, unknown>;
      return {
        name: ds.name,
        type: ds.type,
        schema: schemaWithoutPreview,
      };
    } catch (err) {
      return { error: `Failed to inspect schema: ${(err as Error).message}` };
    }
  },
});
