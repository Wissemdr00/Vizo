import { getModel } from "./providers";
import { buildSystemPrompt } from "./prompts/system";
import { inspectSchemaTool } from "./tools/inspect-schema";
import { profileDataTool } from "./tools/profile-data";
import { analyzeResultsTool } from "./tools/analyze-results";
import { suggestFollowupsTool } from "./tools/suggest-followups";
import { executeSQLTool } from "./tools/execute-sql";
import { executePythonTool } from "./tools/execute-python";
import { renderChartTool } from "./tools/render-chart";
import { proactiveAnalysisTool } from "./tools/proactive-analysis";
import { applyTemplateTool } from "./tools/apply-template";
import { generateReportTool } from "./tools/generate-report";

export const MAX_STEPS = 8;

export const agentTools = {
  inspect_schema: inspectSchemaTool,
  execute_sql: executeSQLTool,
  execute_python: executePythonTool,
  render_chart: renderChartTool,
  profile_data: profileDataTool,
  analyze_results: analyzeResultsTool,
  suggest_followups: suggestFollowupsTool,
  proactive_analysis: proactiveAnalysisTool,
  apply_template: applyTemplateTool,
  generate_report: generateReportTool,
};

export function getAgentConfig(opts: {
  provider: "openai" | "anthropic";
  schemas: { name: string; type: string; columns?: { name: string; type: string }[]; tables?: unknown[] }[];
  workspaceName: string;
  workspaceId?: string;
}) {
  return {
    model: getModel(opts.provider),
    system: buildSystemPrompt({
      schemas: opts.schemas,
      workspaceName: opts.workspaceName,
    }),
    tools: agentTools,
    maxSteps: MAX_STEPS,
  };
}
