import { describe, it, expect } from "vitest";
import { validateReadOnlySQL } from "../execution/sql-validator";

describe("validateReadOnlySQL", () => {
  // --- Valid queries ---
  it("allows simple SELECT", () => {
    expect(validateReadOnlySQL("SELECT * FROM users")).toEqual({ valid: true });
  });

  it("allows SELECT with WHERE", () => {
    expect(validateReadOnlySQL("SELECT id, name FROM orders WHERE status = 'active'")).toEqual({ valid: true });
  });

  it("allows WITH (CTE)", () => {
    expect(validateReadOnlySQL("WITH cte AS (SELECT 1) SELECT * FROM cte")).toEqual({ valid: true });
  });

  it("allows EXPLAIN", () => {
    expect(validateReadOnlySQL("EXPLAIN SELECT * FROM users")).toEqual({ valid: true });
  });

  it("allows SHOW", () => {
    expect(validateReadOnlySQL("SHOW TABLES")).toEqual({ valid: true });
  });

  it("allows DESCRIBE", () => {
    expect(validateReadOnlySQL("DESCRIBE users")).toEqual({ valid: true });
  });

  it("allows PRAGMA", () => {
    expect(validateReadOnlySQL("PRAGMA table_info(users)")).toEqual({ valid: true });
  });

  it("handles case insensitivity", () => {
    expect(validateReadOnlySQL("select * from users")).toEqual({ valid: true });
  });

  // --- Forbidden operations ---
  it("blocks INSERT", () => {
    const result = validateReadOnlySQL("INSERT INTO users VALUES (1, 'test')");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("INSERT");
  });

  it("blocks UPDATE", () => {
    const result = validateReadOnlySQL("UPDATE users SET name = 'x'");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("UPDATE");
  });

  it("blocks DELETE", () => {
    const result = validateReadOnlySQL("DELETE FROM users WHERE id = 1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("DELETE");
  });

  it("blocks DROP TABLE", () => {
    const result = validateReadOnlySQL("DROP TABLE users");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("DROP");
  });

  it("blocks ALTER TABLE", () => {
    const result = validateReadOnlySQL("ALTER TABLE users ADD COLUMN age INT");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("ALTER");
  });

  it("blocks CREATE TABLE", () => {
    const result = validateReadOnlySQL("CREATE TABLE hack (id INT)");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("CREATE");
  });

  it("blocks TRUNCATE", () => {
    const result = validateReadOnlySQL("TRUNCATE TABLE users");
    expect(result.valid).toBe(false);
  });

  it("blocks GRANT", () => {
    const result = validateReadOnlySQL("GRANT ALL ON users TO hacker");
    expect(result.valid).toBe(false);
  });

  // --- SQL injection patterns ---
  it("blocks multiple statements via semicolon", () => {
    const result = validateReadOnlySQL("SELECT 1; DROP TABLE users");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Multiple statements");
  });

  it("strips SQL comments before checking", () => {
    const result = validateReadOnlySQL("SELECT * FROM users -- DROP TABLE users");
    expect(result.valid).toBe(true);
  });

  it("strips multi-line comments", () => {
    const result = validateReadOnlySQL("SELECT /* DROP TABLE */ * FROM users");
    expect(result.valid).toBe(true);
  });

  it("blocks DELETE hidden in comment removal", () => {
    const result = validateReadOnlySQL("DELETE /* comment */ FROM users");
    expect(result.valid).toBe(false);
  });

  // --- Edge cases ---
  it("rejects empty query-like statements", () => {
    const result = validateReadOnlySQL("  ");
    expect(result.valid).toBe(false);
  });

  it("blocks SELECT INTO (contains INTO keyword)", () => {
    const result = validateReadOnlySQL("SELECT * INTO backup FROM users");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("INTO");
  });
});
