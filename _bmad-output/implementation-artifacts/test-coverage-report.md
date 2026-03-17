# Test Coverage Report

## Framework
- **Vitest** 4.x with Node.js environment
- **Config:** `vitest.config.ts` at project root
- **Scripts:** `pnpm test` (single run), `pnpm test:watch` (watch mode)

## Test Files

### `src/lib/__tests__/parse-url.test.ts` (13 tests)
Tests the database URL parser (`src/lib/connectors/parse-url.ts`):

| Test | Status |
|---|---|
| Parses standard postgresql URL | ✅ |
| Parses postgres:// alias scheme | ✅ |
| Parses mysql URL | ✅ |
| Uses default ports when not specified | ✅ |
| Handles URL-encoded passwords | ✅ |
| Detects SSL from sslmode param | ✅ |
| Parses Supabase-style URLs | ✅ |
| Rejects unsupported schemes (mongodb) | ✅ |
| Rejects missing host | ✅ |
| Rejects missing database | ✅ |
| Rejects missing username | ✅ |
| Rejects invalid URL format | ✅ |
| Trims whitespace | ✅ |

### `src/lib/__tests__/sql-validator.test.ts` (22 tests)
Tests the read-only SQL validator (`src/lib/execution/sql-validator.ts`):

| Category | Tests | Status |
|---|---|---|
| Valid queries (SELECT, WITH, EXPLAIN, SHOW, DESCRIBE, PRAGMA) | 8 | ✅ |
| Forbidden DML/DDL (INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, GRANT) | 8 | ✅ |
| SQL injection patterns (semicolons, comment stripping) | 4 | ✅ |
| Edge cases (empty query, SELECT INTO) | 2 | ✅ |

## Coverage Gaps (Not Yet Tested)
- CSV parser (`src/lib/parsers/csv.ts`) — uses `server-only` import, needs mock
- JSON parser (`src/lib/parsers/json.ts`) — uses `server-only` import, needs mock
- Excel parser (`src/lib/parsers/excel.ts`) — uses `server-only` import, needs mock
- Chat API route — requires mocking AI SDK `streamText`
- React components — requires `@testing-library/react` with jsdom environment

## Total: 35 tests, 35 passing
