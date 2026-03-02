# Story 5.1: Proactive Analysis on Upload

## Status: ✅ Complete

## Story
As a user, I want automatic insights when I upload a new data source.

## Acceptance Criteria
- [x] `proactive_analysis` agent tool runs on data upload
- [x] Detects outliers, null rates, distributions
- [x] Suggests relevant chart types
- [x] Returns structured insights summary

### Files Created
- `src/lib/ai/tools/proactive-analysis.ts` — Auto-detect insights from schema + preview data

### Technical Notes
- Analyzes: null percentages per column, numeric distributions, distinct value counts
- Suggests charts based on column types (categorical → bar, numeric × numeric → scatter, date → line)
- Returns `{ insights: [], suggestedCharts: [], nullAlerts: [] }`
- Triggered by agent when user says "analyze this data" or on first query after upload
