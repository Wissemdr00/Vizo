import "server-only";
import type { ColumnSchema, ParsedFileResult } from "./csv";

// Uses xlsx package (SheetJS) — must be installed: pnpm add xlsx
export async function parseExcel(
  buffer: Buffer,
  sheetName?: string
): Promise<{ sheets: string[]; result: ParsedFileResult | null }> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheets = workbook.SheetNames;

  if (!sheetName) {
    // Return sheet list for user selection
    return { sheets, result: null };
  }

  if (!sheets.includes(sheetName)) {
    throw new Error(`Sheet "${sheetName}" not found. Available: ${sheets.join(", ")}`);
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: null,
  });

  if (rows.length === 0) {
    return { sheets, result: { columns: [], rowCount: 0, previewRows: [] } };
  }

  const headers = Object.keys(rows[0]);

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
    const values = rows.map((r) => r[name]);
    const nullCount = values.filter((v) => v == null).length;
    return {
      name,
      type: inferType(values),
      nullPercentage: rows.length > 0 ? Math.round((nullCount / rows.length) * 100) : 0,
      sampleValues: values.slice(0, 5) as (string | number | boolean | null)[],
    };
  });

  return {
    sheets,
    result: {
      columns,
      rowCount: rows.length,
      previewRows: rows.slice(0, 100) as Record<string, unknown>[],
    },
  };
}
