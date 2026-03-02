# Story 2.5: MySQL Database Connector

## Status: ✅ Complete

## Story
As a user, I want to connect my MySQL database as a live data source.

## Acceptance Criteria
- [x] Connection form shared with PostgreSQL (type selector)
- [x] Test connection for MySQL
- [x] Schema introspection via information_schema
- [x] Credentials encrypted same as PostgreSQL

### Files Created
- `src/lib/connectors/mysql.ts` — mysql2 introspection (information_schema queries)

### Files Modified
- `src/app/api/app/data-sources/test-connection/route.ts` — Added MySQL connection testing
- `src/app/api/app/data-sources/connect/route.ts` — Added MySQL connection saving

### Technical Notes
- Uses `mysql2/promise` for connections
- Same schema format as PostgreSQL: `{ tables: [{ name, columns, estimatedRowCount }] }`
- Row count from `information_schema.TABLES.TABLE_ROWS`
