import { tool } from "../tool";
import { z } from "zod";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { eq } from "drizzle-orm";
import { executeFileSQL, executeLiveSQL } from "@/lib/execution/duckdb";

export const executeSQLTool = tool({
  description: "Execute a read-only SQL query against a data source. For file-based sources (CSV/JSON/Excel), data is loaded into DuckDB with a table named 'data'. For database sources, runs against the live connection. Only SELECT queries allowed.",
  parameters: z.object({
    dataSourceId: z.string().describe("The data source to query"),
    sql: z.string().describe("The SQL SELECT query to execute"),
  }),
  execute: async ({ dataSourceId, sql }) => {
    try {
      const [ds] = await db
        .select()
        .from(dataSources)
        .where(eq(dataSources.id, dataSourceId));

      if (!ds) return { error: "Data source not found" };

      const fileTypes = ["csv", "json", "excel"];
      const dbTypes = ["postgresql", "mysql"];

      if (fileTypes.includes(ds.type)) {
        const storagePath = ds.config?.fileUrl;
        if (!storagePath) return { error: "File path not found in data source config" };
        return await executeFileSQL(storagePath, sql, ds.type as "csv" | "json" | "excel");
      }

      if (dbTypes.includes(ds.type)) {
        const encryptedConfig = ds.config?.connectionString;
        if (!encryptedConfig) return { error: "Connection config not found" };
        return await executeLiveSQL(encryptedConfig, sql, ds.type as "postgresql" | "mysql");
      }

      return { error: `Unsupported data source type: ${ds.type}` };
    } catch (err) {
      return { error: `SQL execution failed: ${(err as Error).message}` };
    }
  },
});
