# Story 1.3: Workspace Quotas & Auto-Creation

## Status: ✅ Complete

## Story
As a user, I want my workspace count enforced by my plan quotas, and a default workspace auto-created on first login.

## Acceptance Criteria
- [x] `ensureWorkspace()` utility creates a default workspace if user has none
- [x] Workspace creation API checks `maxWorkspaces` quota from user's plan
- [x] Returns 403 with clear message when quota exceeded

## Implementation Details

### Files Created
- `src/lib/workspaces/ensureWorkspace.ts` — Auto-create default workspace on first access

### Files Modified
- `src/app/api/app/workspaces/route.ts` — Added quota check against `plan.quotas.maxWorkspaces`

### Technical Notes
- Quota values stored in `plans.quotas` JSONB column (parsed via `quotaSchema`)
- `ensureWorkspace()` called from workspace listing to guarantee at least one workspace exists
- Plan lookup via `users.planId` → `plans` join
