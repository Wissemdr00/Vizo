# Fix Log: Chat, OpenRouter, Persistence & Connectors

## Date: Session 10+

## Issues Fixed

### 1. OpenRouter Provider — Official SDK Integration
**Problem:** Using `@ai-sdk/openai` with `baseURL: "https://openrouter.ai/api/v1"` hack. Free models had unreliable tool calling.
**Fix:** Installed `@openrouter/ai-sdk-provider@2.2.3`, updated `src/lib/ai/providers.ts` to use `createOpenRouter()`.
**Files:** `src/lib/ai/providers.ts`

### 2. AI SDK v6 Migration (from v4)
**Problem:** `AI_UnsupportedModelVersionError` — user installed `@ai-sdk/openai@3.x` (v6 packages) while keeping `ai@4.3.19`.
**Fix:** Full migration to `ai@6.0.116` with all breaking changes:
- `Message` → `UIMessage` (no `.content`, use `.parts`)
- `convertToCoreMessages` → `convertToModelMessages` (async)
- `toDataStreamResponse()` → `toUIMessageStreamResponse()`
- `useChat` API: `transport` (DefaultChatTransport), `sendMessage({ text })`, `status` instead of `isLoading`
- Created `src/lib/ai/tool.ts` wrapper for Zod inference issues

**Files:** `src/app/api/app/chat/route.ts`, `src/components/chat/chat-panel.tsx`, `src/lib/ai/tool.ts`, all 10 `src/lib/ai/tools/*.ts`

### 3. Conversation Persistence on Refresh
**Problem:** Messages saved to DB in `onFinish` but never loaded back when page refreshes.
**Fix:**
- Updated `GET /api/app/conversations/[id]` to include messages (ordered by `createdAt asc`)
- Added `useEffect` in chat page to fetch messages on conversation select
- Pass `initialMessages` to ChatPanel mapped to UIMessage format

**Files:** `src/app/api/app/conversations/[id]/route.ts`, `src/app/(in-app)/app/workspace/[id]/chat/page.tsx`

### 4. AI Tool Execution — DataSource IDs Missing
**Problem:** AI couldn't call tools because system prompt didn't include `dataSourceId`.
**Fix:** Added `id` to DataSourceSchema interface and output `**dataSourceId**: \`{id}\`` in context.
**Files:** `src/lib/ai/prompts/schema-context.ts`, `src/lib/ai/prompts/system.ts`, `src/lib/ai/agent.ts`, `src/app/api/app/chat/route.ts`

### 5. Database Connection URL Support
**Problem:** Only individual field forms for database connections. Supabase/Neon users paste URLs.
**Fix:**
- Created `parseDatabaseUrl()` supporting `postgresql://`, `postgres://`, `mysql://` with SSL detection
- Created `POST /api/app/data-sources/connect-url` endpoint
- Added URL tab to `DatabaseConnectForm` (URL vs Manual Fields toggle)

**Files:** `src/lib/connectors/parse-url.ts`, `src/app/api/app/data-sources/connect-url/route.ts`, `src/app/(in-app)/app/workspace/[id]/sources/page.tsx`

### 6. Chat Panel Tool Results Display
**Problem:** Chat panel only rendered text, not tool invocation results.
**Fix:** Full ChatPanel rewrite rendering `UIMessagePart[]` including `tool-invocation` parts with SQL tables, profiling, error display.
**Files:** `src/components/chat/chat-panel.tsx`

---

## Test Suite Added

**Framework:** Vitest 4.x (`vitest.config.ts` added)
**Test files:**
- `src/lib/__tests__/parse-url.test.ts` — 13 tests (URL parsing, Supabase URLs, edge cases)
- `src/lib/__tests__/sql-validator.test.ts` — 22 tests (SELECT allowed, DDL/DML blocked, injection patterns)

**Run:** `pnpm test` (35 tests, all passing)

---

## Architecture Notes

- **NOT using LangChain** — Raw Vercel AI SDK v6 `streamText` with `maxSteps: 8` tool loop
- **10 tools:** inspect_schema, execute_sql, execute_python, render_chart, profile_data, analyze_results, suggest_followups, proactive_analysis, apply_template, generate_report
- **Key packages:** `ai@6.0.116`, `@ai-sdk/react@3.0.118`, `@openrouter/ai-sdk-provider@2.2.3`
- **Model:** `meta-llama/llama-3.3-70b-instruct:free` via OpenRouter (tool calling may be limited on free tier)

## Remaining Issues
- MongoDB connector not yet implemented (requested by user)
- Chat markdown rendering not yet added (react-markdown)
- Free OpenRouter models may not reliably support tool calling — suggest paid model for production
