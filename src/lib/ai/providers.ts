import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function getModel(provider: "openai" | "anthropic" | "openrouter" = "openai") {
  if (provider === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return anthropic("claude-sonnet-4-20250514");
  }

  if (provider === "openrouter") {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter("meta-llama/llama-3.3-70b-instruct:free");
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai("gpt-4o");
}
