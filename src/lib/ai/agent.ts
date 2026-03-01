import { getModel } from "./providers";
import { buildSystemPrompt } from "./prompts/system";
import { inspectSchemaTool } from "./tools/inspect-schema";
import { profileDataTool } from "./tools/profile-data";
import { analyzeResultsTool } from "./tools/analyze-results";
import { suggestFollowupsTool } from "./tools/suggest-followups";

export const MAX_STEPS = 8;

export const agentTools = {
  inspect_schema: inspectSchemaTool,
  profile_data: profileDataTool,
  analyze_results: analyzeResultsTool,
  suggest_followups: suggestFollowupsTool,
};

export function getAgentConfig(opts: {
  provider: "openai" | "anthropic";
  schemas: { name: string; type: string; columns?: { name: string; type: string }[]; tables?: unknown[] }[];
  workspaceName: string;
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
