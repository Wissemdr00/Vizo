# Story 2.6: Data Source Management & Quotas

## Status: ✅ Complete

## Story
As a user, I want to manage my data sources (list, delete, refresh) with plan quota enforcement.

## Acceptance Criteria
- [x] Data source listing per workspace
- [x] Delete with S3 storage cleanup
- [x] Refresh schema for live database sources
- [x] Quota enforcement: max data sources per plan

### Files Created
- `src/app/api/app/data-sources/[id]/route.ts` — GET/DELETE single source
- `src/app/api/app/data-sources/[id]/refresh/route.ts` — Re-introspect live database schema
- `src/app/(in-app)/app/workspace/[id]/sources/page.tsx` — Sources list page

### Technical Notes
- Delete cascades: removes DB record + S3 file (for file-based sources)
- Refresh re-runs introspection and updates schema JSONB in-place
- Quota check runs on creation: count sources in workspace vs plan limit
