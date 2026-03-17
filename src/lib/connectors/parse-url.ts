import type { DatabaseCredentials } from "./types";

/**
 * Parse a database connection URL into individual credentials.
 * Supports: postgresql://, postgres://, mysql://
 */
export function parseDatabaseUrl(
  url: string
): { type: "postgresql" | "mysql"; credentials: DatabaseCredentials } | { error: string } {
  try {
    const trimmed = url.trim();

    // Normalize postgres:// to postgresql://
    const normalized = trimmed.startsWith("postgres://")
      ? trimmed.replace("postgres://", "postgresql://")
      : trimmed;

    let type: "postgresql" | "mysql";
    if (normalized.startsWith("postgresql://")) {
      type = "postgresql";
    } else if (normalized.startsWith("mysql://")) {
      type = "mysql";
    } else {
      return { error: "Unsupported URL scheme. Use postgresql:// or mysql://" };
    }

    // Use URL parser — replace scheme with http:// for parsing
    const parseable = normalized.replace(/^(postgresql|mysql):\/\//, "http://");
    const parsed = new URL(parseable);

    const host = parsed.hostname;
    const port = parsed.port
      ? parseInt(parsed.port, 10)
      : type === "postgresql"
        ? 5432
        : 3306;
    const database = parsed.pathname.replace(/^\//, "") || "";
    const username = decodeURIComponent(parsed.username || "");
    const password = decodeURIComponent(parsed.password || "");

    // Check for SSL params (common in Supabase/Neon URLs)
    const sslMode = parsed.searchParams.get("sslmode");
    const ssl = sslMode ? sslMode !== "disable" : type === "postgresql";

    if (!host) return { error: "Missing host in URL" };
    if (!database) return { error: "Missing database name in URL" };
    if (!username) return { error: "Missing username in URL" };

    return {
      type,
      credentials: { host, port, database, username, password, ssl },
    };
  } catch {
    return { error: "Invalid database URL format" };
  }
}
