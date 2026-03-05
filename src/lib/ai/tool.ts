import { tool as sdkTool } from "ai";
import type { ZodObject, ZodRawShape, infer as ZInfer } from "zod";

/**
 * Typed wrapper around the AI SDK `tool` helper that properly infers
 * parameter types from a ZodObject schema.
 */
export function tool<T extends ZodObject<ZodRawShape>>(config: {
  description?: string;
  parameters: T;
  execute: (args: ZInfer<T>) => Promise<unknown> | unknown;
}) {
  return sdkTool(config as unknown as Parameters<typeof sdkTool>[0]);
}
