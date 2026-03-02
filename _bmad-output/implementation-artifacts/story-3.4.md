# Story 3.4: Agent Tools — inspect_schema & profile_data

## Status: ✅ Complete

## Story
As an AI agent, I need tools to inspect data source schemas and profile data quality.

## Acceptance Criteria
- [x] `inspect_schema` tool returns column names, types for a data source
- [x] `profile_data` tool computes null rates, distinct counts, min/max from preview data
- [x] Tools registered in agent config

### Files Created
- `src/lib/ai/tools/inspect-schema.ts` — Returns schema metadata for a data source
- `src/lib/ai/tools/profile-data.ts` — Computes column-level statistics from preview data

### Technical Notes
- `inspect_schema` reads from DB `schema` JSONB column (no live query needed)
- `profile_data` uses preview rows (stored at upload time) for fast profiling
- Both tools use Zod schemas for input validation
- Error handling returns `{ error: string }` instead of throwing
