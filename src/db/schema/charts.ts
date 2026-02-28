import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import { workspaces } from "./workspaces";
import { conversations } from "./conversations";

export const chartTypeSchema = z.enum([
  "bar",
  "line",
  "area",
  "scatter",
  "pie",
  "donut",
  "heatmap",
  "histogram",
  "box",
  "table",
]);

export type ChartType = z.infer<typeof chartTypeSchema>;

type ChartConfig = {
  xAxis?: string;
  yAxis?: string | string[];
  groupBy?: string;
  aggregation?: "sum" | "avg" | "count" | "min" | "max";
  colors?: string[];
  title?: string;
  subtitle?: string;
  options?: Record<string, unknown>;
};

export const charts = pgTable("charts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  conversationId: text("conversationId").references(() => conversations.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  type: text("type").$type<ChartType>().notNull(),
  config: jsonb("config").$type<ChartConfig>().default({}),
  data: jsonb("data").$type<unknown[]>().default([]),
  sql: text("sql"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
