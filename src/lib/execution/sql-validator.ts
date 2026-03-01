const FORBIDDEN_KEYWORDS = [
  "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE",
  "TRUNCATE", "GRANT", "REVOKE", "EXEC", "EXECUTE",
  "INTO", "MERGE", "REPLACE",
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates that a SQL query is read-only (FR-6.4).
 * Rejects any DML/DDL statements.
 */
export function validateReadOnlySQL(sql: string): ValidationResult {
  const normalized = sql
    .replace(/--.*$/gm, "")       // remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove multi-line comments
    .replace(/\s+/g, " ")          // normalize whitespace
    .trim()
    .toUpperCase();

  // Check for multiple statements (semicolons)
  const statements = normalized.split(";").filter((s) => s.trim());
  if (statements.length > 1) {
    return { valid: false, error: "Multiple statements not allowed. Submit one query at a time." };
  }

  for (const keyword of FORBIDDEN_KEYWORDS) {
    // Match whole-word only
    const regex = new RegExp(`\\b${keyword}\\b`);
    if (regex.test(normalized)) {
      return {
        valid: false,
        error: `${keyword} operations are not allowed. Only SELECT queries are permitted.`,
      };
    }
  }

  // Must start with SELECT, WITH, EXPLAIN, or SHOW
  if (!/^(SELECT|WITH|EXPLAIN|SHOW|DESCRIBE|PRAGMA)\b/.test(normalized)) {
    return { valid: false, error: "Only SELECT queries are allowed." };
  }

  return { valid: true };
}
