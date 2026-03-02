# Story 4.1: DuckDB SQL Engine

## Status: ✅ Complete

## Story
As a user, I want to run SQL queries against my uploaded files using DuckDB.

## Acceptance Criteria
- [x] `execute_sql` agent tool runs SQL via DuckDB
- [x] File-based execution: download from Supabase → /tmp → DuckDB
- [x] Live database execution: connect via decrypted credentials
- [x] SQL validation (no DROP, DELETE, ALTER, TRUNCATE)
- [x] Turbopack-compatible dynamic import

### Files Created
- `src/lib/execution/duckdb.ts` — `executeFileSQL()` and `executeLiveSQL()` functions
- `src/lib/execution/sql-validator.ts` — SQL safety validation (whitelist SELECT/WITH/EXPLAIN)
- `src/lib/ai/tools/execute-sql.ts` — Agent tool wrapping DuckDB execution

### Technical Notes
- **Critical**: DuckDB is a native Node module incompatible with Turbopack's bundler
- **Fix**: Uses `new Function("return require('duckdb')")()` to hide from static analysis
- Also needs `serverExternalPackages: ["duckdb"]` in next.config.ts
- File execution: downloads to `/tmp/${sourceId}.ext`, creates DuckDB in-memory DB, imports with `read_csv_auto`/`read_parquet`
- Live DB execution: uses postgres.js or mysql2 directly (not DuckDB)
