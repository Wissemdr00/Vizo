# Story 2.1: CSV File Upload & Schema Inference

## Status: ✅ Complete

## Story
As a user, I want to upload CSV files and have Vizo automatically detect column names and types.

## Acceptance Criteria
- [x] CSV parsing with PapaParse (header detection, type inference)
- [x] Presigned URL upload to Supabase S3
- [x] Data source record created with inferred schema
- [x] Schema stored as JSONB (column names + types)

### Files Created
- `src/lib/parsers/csv.ts` — `parseCSV()` using PapaParse with type inference (string/number/boolean/date)
- `src/app/api/app/data-sources/upload/route.ts` — Presigned upload endpoint
- `src/app/api/app/data-sources/route.ts` — Data source CRUD (list + create)

### Files Modified
- `src/db/schema/data-sources.ts` — Added `schema` JSONB column, `type` enum, `storageKey`

### Technical Notes
- Type inference samples first 100 rows to detect column types
- Files uploaded to Supabase Storage via presigned URLs (client-side upload)
- Schema format: `{ columns: [{ name, type }] }` for file-based sources
