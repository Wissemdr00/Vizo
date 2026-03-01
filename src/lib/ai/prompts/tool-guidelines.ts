export const TOOL_GUIDELINES = `## Tool Usage Guidelines

You have access to the following tools. Use them strategically:

### inspect_schema
- Call this FIRST if you haven't seen the data structure yet
- Returns column names, types, sample values, row counts
- Use this to understand the data before writing queries

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
`;
