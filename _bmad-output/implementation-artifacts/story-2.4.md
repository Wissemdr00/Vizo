# Story 2.4: PostgreSQL Database Connector

## Status: ✅ Complete

## Story
As a user, I want to connect my PostgreSQL database as a live data source.

## Acceptance Criteria
- [x] Connection form with host, port, database, user, password fields
- [x] Test connection endpoint validates credentials
- [x] Schema introspection discovers tables, columns, types, row counts
- [x] Credentials encrypted with AES-256-GCM before storage
- [x] Live queries executed against connected database

### Files Created
- `src/app/api/app/data-sources/test-connection/route.ts` — Test connection endpoint
- `src/app/api/app/data-sources/connect/route.ts` — Save connection with encrypted credentials
- `src/lib/connectors/postgres.ts` — pg introspection (information_schema queries)
- `src/lib/crypto/credentials.ts` — AES-256-GCM encrypt/decrypt utilities

### Technical Notes
- Uses `postgres` (postgres.js) for connections
- Schema format: `{ tables: [{ name, columns: [{ name, type }], estimatedRowCount }] }`
- Credentials encrypted with `ENCRYPTION_KEY` env var (32-byte hex)
- Introspection queries `information_schema.columns` and `pg_stat_user_tables`
