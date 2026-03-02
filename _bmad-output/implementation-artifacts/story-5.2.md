# Story 5.2: Analysis Templates & Detection

## Status: ✅ Complete

## Story
As a user, I want the AI to detect what type of data I have and suggest relevant analysis templates.

## Acceptance Criteria
- [x] 7 JSON template files with analysis steps
- [x] `matchTemplates()` heuristic matcher
- [x] `apply_template` agent tool
- [x] Templates browse page

### Files Created
- `src/lib/ai/templates/index.ts` — `matchTemplates()` heuristic function
- `src/lib/ai/templates/ad-campaign.json` — Ad campaign analysis template
- `src/lib/ai/templates/sales-kpi.json` — Sales KPI dashboard template
- `src/lib/ai/templates/financial.json` — Financial analysis template
- `src/lib/ai/templates/ecommerce.json` — E-commerce metrics template
- `src/lib/ai/templates/user-analytics.json` — User behavior analytics template
- `src/lib/ai/templates/churn.json` — Customer churn analysis template
- `src/lib/ai/templates/operations.json` — Operations & logistics template
- `src/lib/ai/tools/apply-template.ts` — Agent tool to apply matched template
- `src/app/(in-app)/app/templates/page.tsx` — Browse templates page

### Technical Notes
- `matchTemplates()` uses column name heuristics (e.g., "revenue" → sales_kpi, "click" → ad_campaign)
- Each template has: name, description, requiredColumns, analysisSteps[], suggestedCharts[]
- Templates are static JSON (no DB storage needed)
- Agent uses `apply_template` to structure analysis according to matched template
