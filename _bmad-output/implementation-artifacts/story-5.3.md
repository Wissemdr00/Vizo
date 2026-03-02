# Story 5.3: Report Generation

## Status: ✅ Complete

## Story
As a user, I want to generate and save analysis reports from my conversations.

## Acceptance Criteria
- [x] `generate_report` agent tool creates structured report
- [x] Reports CRUD API (create, list, get, delete)
- [x] Reports page in workspace navigation
- [x] `useReports` SWR hook

### Files Created
- `src/lib/ai/tools/generate-report.ts` — Agent tool that compiles conversation into report
- `src/app/api/app/reports/route.ts` — List + create reports
- `src/app/api/app/reports/[id]/route.ts` — GET/DELETE single report
- `src/lib/reports/useReports.ts` — SWR hook for reports list
- `src/app/(in-app)/app/workspace/[id]/reports/page.tsx` — Reports list page
- `src/db/schema/reports.ts` — Reports table (workspaceId, title, content, template)

### Technical Notes
- Reports contain: title, executive summary, findings[], charts[], recommendations
- Content stored as JSONB for flexible rendering
- Agent generates report from conversation context + analysis results
- Workspace nav includes "Reports" tab alongside Chat, Sources, Gallery
