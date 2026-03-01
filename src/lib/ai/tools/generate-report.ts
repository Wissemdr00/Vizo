import { tool } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";

export const generateReportTool = tool({
  description: "Generate a multi-chart business report from analysis results. Assembles KPI cards, charts, insights, and recommendations into a structured report document. Call this as the final step of a template execution or when explicitly requested.",
  parameters: z.object({
    workspaceId: z.string().describe("The workspace to save the report in"),
    conversationId: z.string().optional().describe("The conversation this report came from"),
    title: z.string().describe("Report title"),
    template: z.enum(["ad_campaign", "sales_kpi", "financial", "ecommerce", "user_analytics", "churn", "operations", "custom"]).default("custom"),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string(),
      chartIds: z.array(z.string()).optional(),
      order: z.number(),
    })).describe("Report sections with content and chart references"),
    insights: z.array(z.string()).optional().describe("Key insights discovered"),
    dataSourceIds: z.array(z.string()).optional(),
  }),
  execute: async ({ workspaceId, conversationId, title, template, sections, insights, dataSourceIds }) => {
    try {
      const [report] = await db
        .insert(reports)
        .values({
          workspaceId,
          conversationId: conversationId || null,
          title,
          template,
          status: "complete",
          sections,
          meta: {
            generatedInsights: insights || [],
            dataSourceIds: dataSourceIds || [],
          },
        })
        .returning();

      return {
        reportId: report.id,
        title: report.title,
        template: report.template,
        sectionCount: sections.length,
        message: `Report "${title}" has been saved. You can view it in the Reports tab.`,
      };
    } catch (err) {
      return { error: `Failed to save report: ${(err as Error).message}` };
    }
  },
});
