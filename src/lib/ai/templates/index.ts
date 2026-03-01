import adCampaign from "./ad-campaign.json";
import salesKpi from "./sales-kpi.json";
import financialOverview from "./financial-overview.json";
import ecommerce from "./ecommerce.json";
import userAnalytics from "./user-analytics.json";
import churnRetention from "./churn-retention.json";
import operations from "./operations.json";

export interface AnalysisTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredColumns: { name: string; aliases: string[]; type: "string" | "number" | "date" }[];
  steps: { tool: string; description: string; params: Record<string, unknown> }[];
  outputs: { type: "kpi" | "chart" | "insight" | "recommendation"; title: string }[];
}

export const templates: AnalysisTemplate[] = [
  adCampaign,
  salesKpi,
  financialOverview,
  ecommerce,
  userAnalytics,
  churnRetention,
  operations,
] as AnalysisTemplate[];

/**
 * Match a data source schema against templates using column name heuristics.
 * Returns templates sorted by match score.
 */
export function matchTemplates(
  columns: { name: string; type: string }[]
): { template: AnalysisTemplate; score: number; matchedColumns: string[] }[] {
  const colNames = columns.map((c) => c.name.toLowerCase());

  return templates
    .map((template) => {
      let matched = 0;
      const matchedColumns: string[] = [];

      for (const req of template.requiredColumns) {
        const allNames = [req.name.toLowerCase(), ...req.aliases.map((a) => a.toLowerCase())];
        const found = colNames.some((col) =>
          allNames.some((alias) => col.includes(alias) || alias.includes(col))
        );
        if (found) {
          matched++;
          matchedColumns.push(req.name);
        }
      }

      const score = template.requiredColumns.length > 0
        ? matched / template.requiredColumns.length
        : 0;

      return { template, score, matchedColumns };
    })
    .filter((m) => m.score > 0.3)
    .sort((a, b) => b.score - a.score);
}
