import { describe, it, expect } from "vitest";
import { parseDatabaseUrl } from "../connectors/parse-url";

describe("parseDatabaseUrl", () => {
  it("parses a standard postgresql URL", () => {
    const result = parseDatabaseUrl("postgresql://user:pass@localhost:5432/mydb");
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.type).toBe("postgresql");
    expect(result.credentials).toEqual({
      host: "localhost",
      port: 5432,
      database: "mydb",
      username: "user",
      password: "pass",
      ssl: true, // default for postgresql
    });
  });

  it("parses postgres:// scheme (alias)", () => {
    const result = parseDatabaseUrl("postgres://user:pass@host.com/db");
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.type).toBe("postgresql");
    expect(result.credentials.host).toBe("host.com");
    expect(result.credentials.port).toBe(5432); // default
  });

  it("parses a mysql URL", () => {
    const result = parseDatabaseUrl("mysql://root:secret@db.host.com:3307/analytics");
    expect(result).not.toHaveProperty("error");
    if ("error" in result) return;
    expect(result.type).toBe("mysql");
    expect(result.credentials).toEqual({
      host: "db.host.com",
      port: 3307,
      database: "analytics",
      username: "root",
      password: "secret",
      ssl: false, // default for mysql
    });
  });

  it("uses default port when not specified", () => {
    const pg = parseDatabaseUrl("postgresql://u:p@h/db");
    if ("error" in pg) return;
    expect(pg.credentials.port).toBe(5432);

    const mysql = parseDatabaseUrl("mysql://u:p@h/db");
    if ("error" in mysql) return;
    expect(mysql.credentials.port).toBe(3306);
  });

  it("handles URL-encoded password", () => {
    const result = parseDatabaseUrl("postgresql://user:p%40ss%23word@host/db");
    if ("error" in result) return;
    expect(result.credentials.password).toBe("p@ss#word");
  });

  it("detects SSL from sslmode param", () => {
    const withSsl = parseDatabaseUrl("postgresql://u:p@h/db?sslmode=require");
    if ("error" in withSsl) return;
    expect(withSsl.credentials.ssl).toBe(true);

    const noSsl = parseDatabaseUrl("postgresql://u:p@h/db?sslmode=disable");
    if ("error" in noSsl) return;
    expect(noSsl.credentials.ssl).toBe(false);
  });

  it("parses Supabase-style URL", () => {
    const result = parseDatabaseUrl(
      "postgresql://postgres.abc123:MyPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
    );
    if ("error" in result) return;
    expect(result.type).toBe("postgresql");
    expect(result.credentials.host).toBe("aws-0-us-east-1.pooler.supabase.com");
    expect(result.credentials.port).toBe(6543);
    expect(result.credentials.database).toBe("postgres");
    expect(result.credentials.ssl).toBe(true);
  });

  it("returns error for unsupported scheme", () => {
    const result = parseDatabaseUrl("mongodb://user:pass@host/db");
    expect(result).toHaveProperty("error");
  });

  it("returns error for missing host", () => {
    const result = parseDatabaseUrl("postgresql://:pass@/db");
    expect(result).toHaveProperty("error");
  });

  it("returns error for missing database", () => {
    const result = parseDatabaseUrl("postgresql://user:pass@host/");
    expect(result).toHaveProperty("error");
  });

  it("returns error for missing username", () => {
    const result = parseDatabaseUrl("postgresql://:pass@host/db");
    expect(result).toHaveProperty("error");
  });

  it("returns error for invalid URL", () => {
    const result = parseDatabaseUrl("not a url at all");
    expect(result).toHaveProperty("error");
  });

  it("trims whitespace", () => {
    const result = parseDatabaseUrl("  postgresql://u:p@h/db  ");
    expect(result).not.toHaveProperty("error");
  });
});
