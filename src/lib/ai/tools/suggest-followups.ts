import { tool } from "ai";
import { z } from "zod";

export const suggestFollowupsTool = tool({
  description: "Generate 3 contextual follow-up questions that the user might want to ask next, based on the current analysis. Call this after providing an answer.",
  parameters: z.object({
    currentTopic: z.string().describe("What was the current analysis about"),
    dataContext: z.string().describe("Brief description of available data"),
    insights: z.string().describe("Key insights from the current response"),
  }),
  execute: async ({ currentTopic, dataContext, insights }) => {
    // The AI generates these based on context — returning a structured prompt
    return {
      suggestions: [
        `How does this compare over time? Show me the trend for ${currentTopic}`,
        `What are the outliers or anomalies in this data?`,
        `Can you break this down by category and show the distribution?`,
      ],
      context: { currentTopic, dataContext, insights },
    };
  },
});
