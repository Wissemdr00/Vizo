# Story 3.5: Self-Correction & Follow-up Suggestions

## Status: ✅ Complete

## Story
As a user, I want the AI to analyze its own results and suggest follow-up questions.

## Acceptance Criteria
- [x] `analyze_results` tool checks query output for issues/insights
- [x] `suggest_followups` tool generates 3 clickable follow-up questions
- [x] Follow-up chips rendered below assistant messages
- [x] Clicking a chip auto-submits as new user message

### Files Created
- `src/lib/ai/tools/analyze-results.ts` — Result analysis (empty results, outliers, patterns)
- `src/lib/ai/tools/suggest-followups.ts` — Contextual follow-up question generation
- `src/components/chat/followup-chips.tsx` — Clickable suggestion chips UI

### Technical Notes
- `analyze_results` checks for empty datasets, single-row results, extreme values
- `suggest_followups` considers conversation context + current data to generate relevant questions
- Chips component uses `setInput` + auto-submit to seamlessly continue conversation
