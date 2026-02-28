import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import { workspaces } from "./workspaces";
import { conversations } from "./conversations";

export const reportStatusSchema = z.enum([
  "draft",
  "generating",
  "complete",
  "failed",
]);

export type ReportStatus = z.infer<typeof reportStatusSchema>;

export const reportTemplateSchema = z.enum([
  "ad_campaign",
  "sales_kpi",
  "financial",
  "ecommerce",
  "user_analytics",
  "churn",
  "operations",
  "custom",
]);

export type ReportTemplate = z.infer<typeof reportTemplateSchema>;

type ReportSection = {
  title: string;
  content: string;
  chartIds?: string[];
  order: number;
};

type ReportMeta = {
  templateConfig?: Record<string, unknown>;
  generatedInsights?: string[];
  dataSourceIds?: string[];
  executionTimeMs?: number;
};

export const reports = pgTable("reports", {
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
  template: text("template").$type<ReportTemplate>().default("custom"),
  status: text("status").$type<ReportStatus>().notNull().default("draft"),
  sections: jsonb("sections").$type<ReportSection[]>().default([]),
  meta: jsonb("meta").$type<ReportMeta>().default({}),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
