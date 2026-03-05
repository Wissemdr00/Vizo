import { tool } from "../tool";
import { z } from "zod";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { eq } from "drizzle-orm";
import { executePython } from "@/lib/execution/pyodide";

export const executePythonTool = tool({
  description: "Execute Python code for statistical analysis, ML, or complex data transformations. Available packages: pandas, numpy, scipy, sklearn, matplotlib, statistics. Data is pre-loaded as a pandas DataFrame named 'df'. Store your result in a variable named 'result'.",
  parameters: z.object({
    dataSourceId: z.string().describe("The data source (pre-loaded as df)"),
    code: z.string().describe("Python code to execute. Use 'df' for data, store output in 'result'."),
  }),
  execute: async ({ dataSourceId, code }) => {
    try {
      const [ds] = await db
        .select()
        .from(dataSources)
        .where(eq(dataSources.id, dataSourceId));

      if (!ds) return { error: "Data source not found" };

      // Get preview data to pass to Python
      const schema = ds.schema as { previewRows?: Record<string, unknown>[] } | null;
      const dataJson = schema?.previewRows
        ? JSON.stringify(schema.previewRows)
        : "[]";

      return await executePython(code, dataJson);
    } catch (err) {
      return { error: `Python execution failed: ${(err as Error).message}` };
    }
  },
});
