# Story 3.1: AI Provider Config & Agent Core

## Status: ✅ Complete

## Story
As a developer, I want a configurable AI agent with provider selection and tool registration.

## Acceptance Criteria
- [x] Provider configuration (OpenAI + Anthropic)
- [x] Agent config function with model selection
- [x] System prompt builder with schema context
- [x] Tool registration framework (initial 4 tools)

### Files Created
- `src/lib/ai/providers.ts` — `getModel()` function for openai/anthropic selection
- `src/lib/ai/agent.ts` — `getAgentConfig()` with tools, system prompt, maxSteps
- `src/lib/ai/prompts/system.ts` — `buildSystemPrompt()` with workspace context
- `src/lib/ai/prompts/schema-context.ts` — `buildSchemaContext()` for file/DB schemas
- `src/lib/ai/prompts/tool-guidelines.ts` — Tool usage documentation for system prompt
- `src/lib/ai/prompts/safety-rules.ts` — SQL safety constraints (no DROP/DELETE/ALTER)

### Technical Notes
- Uses `ai@4.3.19` with `@ai-sdk/openai` and `@ai-sdk/anthropic`
- Model type cast needed: `as unknown as Parameters<typeof streamText>[0]["model"]`
- `maxSteps: 8` allows multi-tool chains
- Tool errors return `{ error }` objects (never throw)
