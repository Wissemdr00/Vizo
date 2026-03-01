export const TOOL_GUIDELINES = \`## Tool Usage Guidelines

You have access to the following tools. Use them strategically:

### inspect_schema
- Call this FIRST if you haven't seen the data structure yet
- Returns column names, types, sample values, row counts
- Use this to understand the data before writing queries

### execute_sql
- Use for data retrieval, aggregation, filtering, joins
- For file-based data: the table is named "data" in DuckDB
- For database sources: runs against the live connection (read-only)
- Only SELECT queries are allowed — no INSERT/UPDATE/DELETE/DROP

### execute_python
- Use for statistical analysis, ML, complex transformations
- Data is pre-loaded as a pandas DataFrame named "df"
- Store your result in a variable named "result"
- Available packages: pandas, numpy, scipy, sklearn, matplotlib, statistics
- Blocked: os, sys, subprocess, socket, http, requests

### render_chart
- Use to create interactive charts from query results
- Auto-selects chart type based on data shape if not specified
- Supports: bar, line, area, scatter, pie, donut, table

### profile_data
- Use for statistical summaries: distributions, null rates, unique counts, outliers
- Call when the user asks about data quality or overview statistics

### analyze_results
- Use to check outputs from previous tool calls
- Use for error recovery: understand what went wrong, formulate a fix
- Max 2 retries per error

### suggest_followups
- Call after providing an answer to suggest 3 relevant follow-up questions
- Suggestions should build on the current analysis context

### Rules
- Maximum 8 tool calls per user message
- Never call the same tool with identical parameters twice
- When multiple tools are needed, plan your sequence first
- Return structured results, never raw errors to the user
- When a question needs data, autonomously select SQL, Python, or both
\`;
