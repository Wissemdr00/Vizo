# Story 7.1: Admin Dashboard & Operations

## Status: ✅ Complete

## Story
As a super admin, I want a dashboard showing Vizo platform metrics.

## Acceptance Criteria
- [x] Vizo stats API endpoint with platform metrics
- [x] 8 metric cards on admin dashboard
- [x] MRR calculation from user plans
- [x] Active users (7-day rolling window)
- [x] Existing admin features preserved (user mgmt, plans, messages, waitlist)

### Files Created
- `src/app/api/super-admin/stats/vizo/route.ts` — Platform metrics API

### Files Modified
- `src/app/super-admin/page.tsx` — Added 8 Vizo metric cards + SWR data fetching

### Dashboard Metrics
1. **Active Users** — Users with messages in last 7 days (via workspaces join)
2. **MRR** — Monthly recurring revenue from user plans
3. **Queries Today** — User messages sent today
4. **Total Workspaces** — Platform-wide workspace count
5. **Total Data Sources** — All connected sources
6. **Total Conversations** — All analysis conversations
7. **Total Reports** — Generated reports count
8. **Top Source Type** — Most popular data source type

### Technical Notes
- Active users query: `workspaces → conversations → messages` (conversations don't have userId)
- MRR: joins `users` ↔ `plans`, sums `monthlyPrice * userCount / 100` (prices in cents)
- Protected by `withSuperAdminAuthRequired` middleware
- Uses SWR for client-side data fetching with loading states
