import "server-only";
import { validateReadOnlySQL } from "./sql-validator";
import { SQL_TIMEOUT_MS, SQL_MAX_ROWS } from "./sandbox-config";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface SQLResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated: boolean;
  executionTimeMs: number;
  error?: string;
}

/**
 * Execute SQL against a file-based data source using DuckDB (FR-6.7).
 * Downloads file from Supabase → /tmp cache → loads into DuckDB → executes → destroys.
 */
export async function executeFileSQL(
  storagePath: string,
  sql: string,
  fileType: "csv" | "json" | "excel"
): Promise<SQLResult> {
  // Validate SQL is read-only
  const validation = validateReadOnlySQL(sql);
  if (!validation.valid) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      truncated: false,
      executionTimeMs: 0,
      error: validation.error,
    };
  }

  const startTime = Date.now();

  // Download file to /tmp
  const tmpDir = path.join(os.tmpdir(), "vizo-duckdb");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const fileName = path.basename(storagePath);
  const tmpFile = path.join(tmpDir, fileName);

  // Check cache
  if (!fs.existsSync(tmpFile)) {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(storagePath);

    if (downloadError || !fileData) {
      return {
        columns: [], rows: [], rowCount: 0, truncated: false,
        executionTimeMs: Date.now() - startTime,
        error: `Failed to download file: ${downloadError?.message || "Unknown error"}`,
      };
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    fs.writeFileSync(tmpFile, buffer);
  }

  try {
    const duckdb = await import("duckdb");
    const dbInstance = new duckdb.Database(":memory:");
    const conn = dbInstance.connect();

    return await new Promise<SQLResult>((resolve) => {
      const timer = setTimeout(() => {
        resolve({
          columns: [], rows: [], rowCount: 0, truncated: false,
          executionTimeMs: SQL_TIMEOUT_MS,
          error: "Query timed out after 30 seconds.",
        });
      }, SQL_TIMEOUT_MS);

      // Create table from file
      let loadSQL: string;
      if (fileType === "csv") {
        loadSQL = `CREATE TABLE data AS SELECT * FROM read_csv_auto('${tmpFile.replace(/\\\\/g, "/")}');`;
      } else if (fileType === "json") {
        loadSQL = `CREATE TABLE data AS SELECT * FROM read_json_auto('${tmpFile.replace(/\\\\/g, "/")}');`;
      } else {
        loadSQL = `CREATE TABLE data AS SELECT * FROM read_csv_auto('${tmpFile.replace(/\\\\/g, "/")}');`;
      }

      conn.run(loadSQL, (loadErr: Error | null) => {
        if (loadErr) {
          clearTimeout(timer);
          resolve({
            columns: [], rows: [], rowCount: 0, truncated: false,
            executionTimeMs: Date.now() - startTime,
            error: `Failed to load data: ${loadErr.message}`,
          });
          return;
        }

        // Execute the user query with row limit
        const limitedSQL = `SELECT * FROM (${sql}) AS q LIMIT ${SQL_MAX_ROWS + 1}`;
        conn.all(limitedSQL, (err: Error | null, result: Record<string, unknown>[]) => {
          clearTimeout(timer);

          if (err) {
            resolve({
              columns: [], rows: [], rowCount: 0, truncated: false,
              executionTimeMs: Date.now() - startTime,
              error: `SQL error: ${err.message}`,
            });
            return;
          }

          const truncated = result.length > SQL_MAX_ROWS;
          const rows = truncated ? result.slice(0, SQL_MAX_ROWS) : result;
          const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

          resolve({
            columns,
            rows,
            rowCount: rows.length,
            truncated,
            executionTimeMs: Date.now() - startTime,
          });

          // Cleanup
          dbInstance.close();
        });
      });
    });
  } catch (err) {
    return {
      columns: [], rows: [], rowCount: 0, truncated: false,
      executionTimeMs: Date.now() - startTime,
      error: `DuckDB error: ${(err as Error).message}`,
    };
  }
}

/**
 * Execute SQL against a live database connection (FR-6.8).
 * Read-only, 30s timeout, 10K row limit.
 */
export async function executeLiveSQL(
  encryptedConfig: string,
  sql: string,
  dbType: "postgresql" | "mysql"
): Promise<SQLResult> {
  const validation = validateReadOnlySQL(sql);
  if (!validation.valid) {
    return {
      columns: [], rows: [], rowCount: 0, truncated: false,
      executionTimeMs: 0, error: validation.error,
    };
  }

  const startTime = Date.now();
  const { decryptJson } = await import("@/lib/encryption/aes");
  const creds = decryptJson<{ host: string; port: number; database: string; username: string; password: string; ssl?: boolean }>(encryptedConfig);

  const limitedSQL = `SELECT * FROM (${sql}) AS q LIMIT ${SQL_MAX_ROWS + 1}`;

  try {
    if (dbType === "postgresql") {
      const postgres = (await import("postgres")).default;
      const pg = postgres({
        host: creds.host,
        port: creds.port,
        database: creds.database,
        username: creds.username,
        password: creds.password,
        ssl: creds.ssl ? "require" : false,
        max: 1,
        idle_timeout: 10,
        connect_timeout: 10,
      });

      const result = await pg.unsafe(limitedSQL);
      await pg.end();

      const truncated = result.length > SQL_MAX_ROWS;
      const rows = truncated ? result.slice(0, SQL_MAX_ROWS) : result;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      return { columns, rows, rowCount: rows.length, truncated, executionTimeMs: Date.now() - startTime };
    } else {
      const mysql = await import("mysql2/promise");
      const conn = await mysql.createConnection({
        host: creds.host, port: creds.port, database: creds.database,
        user: creds.username, password: creds.password,
        connectTimeout: 10000,
      });

      const [rows] = await conn.query(limitedSQL);
      await conn.end();

      const resultRows = rows as Record<string, unknown>[];
      const truncated = resultRows.length > SQL_MAX_ROWS;
      const sliced = truncated ? resultRows.slice(0, SQL_MAX_ROWS) : resultRows;
      const columns = sliced.length > 0 ? Object.keys(sliced[0]) : [];

      return { columns, rows: sliced, rowCount: sliced.length, truncated, executionTimeMs: Date.now() - startTime };
    }
  } catch (err) {
    return {
      columns: [], rows: [], rowCount: 0, truncated: false,
      executionTimeMs: Date.now() - startTime,
      error: `Database error: ${(err as Error).message}`,
    };
  }
}
