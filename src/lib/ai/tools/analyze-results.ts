import { tool } from "ai";
import { z } from "zod";

export const analyzeResultsTool = tool({
  description: "Analyze the results of a previous tool call. Use this to check for errors, understand patterns, or decide the next step. Useful for self-correction after a failed tool call.",
  parameters: z.object({
    toolName: z.string().describe("Name of the tool whose results to analyze"),
    result: z.unknown().describe("The result from the previous tool call"),
    question: z.string().describe("What to analyze about the result"),
  }),
  execute: async ({ toolName, result, question }) => {
    // This tool is a meta-analysis helper for the agent
    // The agent uses it to reflect on previous results
    return {
      analysis: {
        tool: toolName,
        hasError: typeof result === "object" && result !== null && "error" in (result as Record<string, unknown>),
        summary: `Analyzed output from ${toolName}. The agent should use this context to: ${question}`,
        recommendation: "Based on the analysis, formulate the next step.",
      },
    };
  },
});
