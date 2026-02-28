# Story 1.2: Workspace CRUD API & Dashboard

Status: in-progress

## Story

As a **user**,
I want to create, view, rename, and delete workspaces from my dashboard,
So that I can organize my data analysis projects.

## Acceptance Criteria

1. Authenticated users see a list of all workspaces with data source count, conversation count, and last activity (FR-2.3)
2. Users can create a workspace with name and optional description (FR-2.1)
3. Users can rename a workspace (FR-2.2)
4. Workspace deletion cascades to all data sources, conversations, messages, and charts (FR-2.5)
5. API responses < 500ms (NFR-1.1)
6. All API routes require valid authenticated session (NFR-2.2)
7. Input validated with Zod schemas (NFR-7.2)

## Tasks / Subtasks

- [x] Task 1: Workspace Zod validation schemas
  - [x] 1.1 Create src/lib/validations/workspace.schema.ts

- [x] Task 2: Workspace API routes
  - [x] 2.1 Create GET /api/app/workspaces (list with counts) — in scaffold script
  - [x] 2.2 Create POST /api/app/workspaces (create) — in scaffold script
  - [x] 2.3 Create PATCH /api/app/workspaces/[id] (rename) — in scaffold script
  - [x] 2.4 Create DELETE /api/app/workspaces/[id] (delete with cascade) — in scaffold script

- [x] Task 3: SWR hook for workspaces
  - [x] 3.1 Create src/lib/workspaces/useWorkspaces.ts — in scaffold script

- [x] Task 4: Workspace dashboard UI
  - [x] 4.1 Create workspace-card component — in scaffold script
  - [x] 4.2 Update app dashboard page with workspace list, create dialog, rename, delete

## Dev Notes

- Follow existing patterns: withAuthRequired, NextResponse.json, Zod validation
- Cascade delete handled by DB schema (onDelete: "cascade" already in conversations, data-sources, etc.)
- Use SWR pattern matching useUser.ts
- Workspace card: name, description, data source count, conversation count, last activity
- API routes + hook + card component written to scaffold script (scripts/scaffold-story-1.2.cjs) since pwsh unavailable to create directories
- Dashboard page (page.tsx) edited directly — integrated workspace CRUD UI with create dialog, workspace grid, empty state

## Dev Agent Record

### Completion Notes

1. Zod schemas: createWorkspaceSchema (name required, description optional), updateWorkspaceSchema (both optional)
2. API: GET returns workspaces with SQL subquery counts for dataSources and conversations. POST creates with Zod validation. PATCH/DELETE use compound where (id + userId) for authorization.
3. Dashboard: Stats row shows live workspace count, workspace grid with cards, create workspace dialog with name + description, empty state CTA
4. WorkspaceCard: hover menu (rename/delete), rename dialog, delete alert dialog with cascade warning

### File List

- `src/lib/validations/workspace.schema.ts` — NEW: Zod schemas for create/update
- `src/app/(in-app)/app/page.tsx` — MODIFIED: Full workspace CRUD UI integration
- `scripts/scaffold-story-1.2.cjs` — NEW: Creates API routes, SWR hook, card component
