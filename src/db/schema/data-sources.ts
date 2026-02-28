import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import { workspaces } from "./workspaces";

export const dataSourceTypeSchema = z.enum([
  "csv",
  "excel",
  "json",
  "parquet",
  "postgresql",
  "mysql",
  "sqlite",
  "mongodb",
  "google_sheets",
  "airtable",
  "notion",
  "rest_api",
  "graphql",
  "bigquery",
  "snowflake",
  "redshift",
]);

export type DataSourceType = z.infer<typeof dataSourceTypeSchema>;

type DataSourceConfig = {
  // File-based
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  // Database
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  // Cloud
  sheetId?: string;
  baseId?: string;
  apiUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
};

export const dataSources = pgTable("data_sources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").$type<DataSourceType>().notNull(),
  config: jsonb("config").$type<DataSourceConfig>().default({}),
  schema: jsonb("schema").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
