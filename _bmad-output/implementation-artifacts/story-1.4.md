# Story 1.4: Vizo Plan Configuration

## Status: ✅ Complete

## Story
As an admin, I want 4 subscription plans (Free, Starter, Pro, Team) configured with Vizo-specific quotas.

## Acceptance Criteria
- [x] 4 plans defined: Free ($0), Starter ($19), Pro ($49), Team ($99)
- [x] Each plan has quotas: monthlyAiQueries, maxDataSources, maxWorkspaces, maxFileUploadSizeMb, codeExecution, prioritySupport
- [x] Seed script creates plans in database
- [x] Pricing page displays all 4 plans with features

### Files Created
- `scripts/seed-plans.ts` — Seeds the 4 Vizo plans into the `plans` table
- `src/db/schema/plans.ts` — Updated with `quotaSchema` (6 quota fields) and `defaultQuotas`

### Files Modified
- Pricing page components auto-render from plans table (no manual feature lists needed)

### Plan Details
| Plan | Price/mo | AI Queries | Sources | Workspaces | Upload | Code Exec | Support |
|------|----------|-----------|---------|------------|--------|-----------|---------|
| Free | $0 | 20 | 2 | 1 | 5MB | ❌ | ❌ |
| Starter | $19 | 200 | 10 | 3 | 25MB | ✅ | ❌ |
| Pro | $49 | 1000 | 50 | 10 | 100MB | ✅ | ✅ |
| Team | $99 | 5000 | 200 | 50 | 500MB | ✅ | ✅ |
