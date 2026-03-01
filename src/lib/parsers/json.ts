import "server-only";
import type { ColumnSchema, ParsedFileResult } from "./csv";

export function parseJSON(content: string): ParsedFileResult {
  const data = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects");
  }

  if (data.length === 0) {
    return { columns: [], rowCount: 0, previewRows: [] };
  }

  // Collect all unique keys across all objects
  const keySet = new Set<string>();
  for (const row of data) {
    if (typeof row === "object" && row !== null) {
      Object.keys(row).forEach((k) => keySet.add(k));
    }
  }

  const headers = Array.from(keySet);

  function inferType(values: unknown[]): "string" | "number" | "date" | "boolean" {
    const nonNull = values.filter((v) => v != null);
    if (nonNull.length === 0) return "string";
    const sample = nonNull.slice(0, 100);
    const boolCount = sample.filter((v) => typeof v === "boolean").length;
    if (boolCount / sample.length > 0.8) return "boolean";
    const numCount = sample.filter((v) => typeof v === "number").length;
    if (numCount / sample.length > 0.8) return "number";
    return "string";
  }

  const columns: ColumnSchema[] = headers.map((name) => {
    const values = data.map((r: Record<string, unknown>) => r[name]);
    const nullCount = values.filter((v: unknown) => v == null).length;
    return {
      name,
      type: inferType(values),
      nullPercentage: data.length > 0 ? Math.round((nullCount / data.length) * 100) : 0,
      sampleValues: values.slice(0, 5) as (string | number | boolean | null)[],
    };
  });

  return {
    columns,
    rowCount: data.length,
    previewRows: data.slice(0, 100) as Record<string, unknown>[],
  };
}
