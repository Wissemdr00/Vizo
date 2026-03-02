# Story 1.5: User Profile & Credit Management

## Status: ✅ Complete

## Story
As a user, I want to manage my profile and see my credit balance for AI queries and code execution.

## Acceptance Criteria
- [x] Credit types configured: `ai_query`, `code_execution`
- [x] 20 `ai_query` credits granted on registration (`onRegisterCredits`)
- [x] Plan page shows current quotas from plan
- [x] Credits history page available

### Files Modified
- `src/config/credits.ts` — Configured `ai_query` and `code_execution` credit types with pricing tiers
- `src/config/plans.ts` — `onRegisterCredits` grants 20 `ai_query` on signup

### Technical Notes
- Credits system is built into Indie Kit boilerplate
- Credit types must match the `creditTypes` config exactly
- Plan quotas auto-render on the plan management page
- Credit purchase flow uses Stripe checkout (preconfigured)
