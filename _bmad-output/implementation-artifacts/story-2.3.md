# Story 2.3: Data Preview Table

## Status: ✅ Complete

## Story
As a user, I want to see a preview of my uploaded data with column types and sample rows.

## Acceptance Criteria
- [x] DataPreviewTable component renders first N rows
- [x] Column headers show name and detected type
- [x] Data source detail page with full preview
- [x] Responsive table with horizontal scroll

### Files Created
- `src/components/data-sources/data-preview-table.tsx` — Reusable preview table component
- `src/app/(in-app)/app/workspace/[id]/sources/[sourceId]/page.tsx` — Source detail page

### Technical Notes
- Preview data stored alongside schema in data source record
- Table uses shadcn `Table` component with overflow-x-auto wrapper
- Limited to 100 preview rows to keep payloads manageable
