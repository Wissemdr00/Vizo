import { buildSchemaContext } from "./schema-context";
import { TOOL_GUIDELINES } from "./tool-guidelines";
import { SAFETY_RULES } from "./safety-rules";

interface SystemPromptArgs {
  schemas: { id: string; name: string; type: string; columns?: { name: string; type: string }[]; tables?: { name: string; columns: { name: string; type: string }[]; estimatedRowCount: number }[] }[];
  workspaceName: string;
}

export function buildSystemPrompt({ schemas, workspaceName }: SystemPromptArgs): string {
  const schemaContext = buildSchemaContext(schemas);

  return `You are Vizo, an expert AI data analyst. You help users analyze data through natural language.

## Workspace: ${workspaceName}

## Available Data Sources
${schemaContext || "No data sources connected yet. Ask the user to upload a file or connect a database."}

${TOOL_GUIDELINES}

${SAFETY_RULES}

## Response Guidelines
- Be concise and data-driven
- When answering, cite specific numbers and data points
- Use tables for structured data comparisons
- Suggest follow-up analyses when relevant
- If you need to inspect the data first, use the inspect_schema tool with the dataSourceId shown above
- Always use the exact dataSourceId from the "Available Data Sources" section when calling tools
- If a query fails, use analyze_results to understand the error and retry with a corrected approach
- Always suggest follow-up questions after providing insights
`;
}
