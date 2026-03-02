# Story 4.5: Chart Gallery

## Status: ✅ Complete

## Story
As a user, I want to save and browse charts generated during my analysis sessions.

## Acceptance Criteria
- [x] Charts CRUD API (save, list, delete)
- [x] Gallery page in workspace navigation
- [x] useCharts SWR hook
- [x] Workspace nav updated with Gallery tab

### Files Created
- `src/app/api/app/charts/route.ts` — List + create charts
- `src/app/api/app/charts/[id]/route.ts` — GET/DELETE single chart
- `src/lib/charts/useCharts.ts` — SWR hook for chart list
- `src/app/(in-app)/app/workspace/[id]/gallery/page.tsx` — Chart gallery page
- `src/db/schema/charts.ts` — Charts table (workspaceId, title, config JSONB)

### Technical Notes
- Chart config stored as JSONB (same format as render_chart tool output)
- Gallery renders charts in a responsive grid using ChartRenderer
- Charts saved manually by user (star/save button on chart)
