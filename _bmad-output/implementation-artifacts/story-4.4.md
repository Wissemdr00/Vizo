# Story 4.4: Chart Rendering

## Status: ✅ Complete

## Story
As a user, I want the AI to generate interactive charts from my data.

## Acceptance Criteria
- [x] `render_chart` agent tool generates chart specifications
- [x] ChartRenderer component supports 7 chart types
- [x] Charts render inline in chat messages
- [x] Interactive tooltips and legends

### Files Created
- `src/lib/ai/tools/render-chart.ts` — Agent tool that outputs chart config
- `src/components/charts/chart-renderer.tsx` — Recharts-based renderer

### Chart Types Supported
1. Bar chart
2. Line chart
3. Area chart
4. Pie chart
5. Scatter plot
6. Radar chart
7. Composed chart (multi-series)

### Technical Notes
- Uses Recharts 2.15.4 for rendering
- Chart spec format: `{ type, data, xKey, yKeys, title, colors }`
- Colors auto-assigned from a palette if not specified
- Responsive container wraps all charts
