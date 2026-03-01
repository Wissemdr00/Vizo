import "server-only";
import Papa from "papaparse";

export interface ColumnSchema {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  nullPercentage: number;
  sampleValues: (string | number | boolean | null)[];
}

export interface ParsedFileResult {
  columns: ColumnSchema[];
  rowCount: number;
  previewRows: Record<string, unknown>[];
}

function inferType(values: (string | null | undefined)[]): "string" | "number" | "date" | "boolean" {
  const nonNull = values.filter((v) => v != null && v !== "");
  if (nonNull.length === 0) return "string";

  const sample = nonNull.slice(0, 100);
  const boolCount = sample.filter((v) => ["true", "false", "yes", "no", "0", "1"].includes(String(v).toLowerCase())).length;
  if (boolCount / sample.length > 0.8) return "boolean";

  const numCount = sample.filter((v) => !isNaN(Number(v)) && String(v).trim() !== "").length;
  if (numCount / sample.length > 0.8) return "number";

  const dateRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/;
  const dateCount = sample.filter((v) => dateRegex.test(String(v))).length;
  if (dateCount / sample.length > 0.8) return "date";

  return "string";
}

export function parseCSV(content: string): ParsedFileResult {
  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const rows = parsed.data as Record<string, string>[];
  const headers = parsed.meta.fields || [];

  const columns: ColumnSchema[] = headers.map((name) => {
    const values = rows.map((r) => r[name]);
    const nullCount = values.filter((v) => v == null || v === "").length;
    return {
      name,
      type: inferType(values),
      nullPercentage: rows.length > 0 ? Math.round((nullCount / rows.length) * 100) : 0,
      sampleValues: values.slice(0, 5),
    };
  });

  return {
    columns,
    rowCount: rows.length,
    previewRows: rows.slice(0, 100) as Record<string, unknown>[],
  };
}
