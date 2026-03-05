import { tool } from "../tool";
import { z } from "zod";
import { templates, matchTemplates } from "../templates";

export const applyTemplateTool = tool({
  description: "Apply a pre-built analysis template to a data source. The template provides a structured sequence of tool calls (inspect → query → chart → insights). Use this when a matching template is detected or the user requests a specific analysis type.",
  parameters: z.object({
    templateId: z.string().describe("The template ID to apply (e.g., 'ad_campaign', 'sales_kpi')"),
    dataSourceId: z.string().describe("The data source to analyze"),
    columns: z.array(z.object({
      name: z.string(),
      type: z.string(),
    })).optional().describe("Data source columns for template matching"),
  }),
  execute: async ({ templateId, dataSourceId, columns }) => {
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      // Try matching by columns
      if (columns) {
        const matches = matchTemplates(columns);
        if (matches.length > 0) {
          return {
            suggestion: true,
            matches: matches.slice(0, 3).map((m) => ({
              id: m.template.id,
              name: m.template.name,
              icon: m.template.icon,
              score: Math.round(m.score * 100),
              matchedColumns: m.matchedColumns,
            })),
            message: "I found matching templates for your data. Which would you like to run?",
          };
        }
      }
      return { error: `Template "${templateId}" not found. Available: ${templates.map((t) => t.id).join(", ")}` };
    }

    // Return template config for the agent to execute step by step
    return {
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        steps: template.steps,
        outputs: template.outputs,
      },
      dataSourceId,
      instruction: `Execute this template step by step. For each step, call the specified tool with appropriate parameters derived from the data source. After all steps, call generate_report to compile the results.`,
    };
  },
});
