"use client";

import { Loader2 } from "lucide-react";

interface ToolCallIndicatorProps {
  toolName: string;
}

export default function ToolCallIndicator({ toolName }: ToolCallIndicatorProps) {
  const labels: Record<string, string> = {
    inspect_schema: "Inspecting data structure...",
    profile_data: "Analyzing data profile...",
    analyze_results: "Reviewing results...",
    suggest_followups: "Generating suggestions...",
    execute_sql: "Running SQL query...",
    execute_python: "Executing Python code...",
    render_chart: "Creating chart...",
  };

  return (
    <div className="flex items-center gap-2 py-2 px-3 text-xs text-muted-foreground bg-muted/50 rounded-lg animate-pulse">
      <Loader2 className="h-3 w-3 animate-spin text-primary" />
      <span>{labels[toolName] || `Running ${toolName}...`}</span>
    </div>
  );
}
