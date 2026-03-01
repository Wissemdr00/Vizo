import "server-only";
import mysql from "mysql2/promise";
import type { ConnectionTestResult, DatabaseCredentials, TableSchema } from "./types";

function createConnection(creds: DatabaseCredentials) {
  return mysql.createConnection({
    host: creds.host,
    port: creds.port,
    database: creds.database,
    user: creds.username,
    password: creds.password,
    ssl: creds.ssl ? {} : undefined,
    connectTimeout: 10000,
  });
}

export async function testMySQLConnection(
  creds: DatabaseCredentials
): Promise<ConnectionTestResult> {
  let conn;
  try {
    conn = await createConnection(creds);
    const [rows] = await conn.query("SELECT VERSION() as version");
    const version = (rows as Record<string, string>[])[0]?.version;
    return { success: true, version };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  } finally {
    await conn?.end();
  }
}

export async function introspectMySQL(
  creds: DatabaseCredentials
): Promise<TableSchema[]> {
  const conn = await createConnection(creds);
  try {
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'",
      [creds.database]
    );

    const result: TableSchema[] = [];

    for (const { TABLE_NAME } of tables as Record<string, string>[]) {
      const [columns] = await conn.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
         ORDER BY ORDINAL_POSITION`,
        [creds.database, TABLE_NAME]
      );

      const [fks] = await conn.query(
        `SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
        [creds.database, TABLE_NAME]
      );

      const [countRows] = await conn.query(
        `SELECT TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [creds.database, TABLE_NAME]
      );

      result.push({
        name: TABLE_NAME,
        columns: (columns as Record<string, string>[]).map((c) => ({
          name: c.COLUMN_NAME,
          type: c.DATA_TYPE,
          nullable: c.IS_NULLABLE === "YES",
          isPrimaryKey: c.COLUMN_KEY === "PRI",
        })),
        foreignKeys: (fks as Record<string, string>[]).map((f) => ({
          column: f.COLUMN_NAME,
          referencedTable: f.REFERENCED_TABLE_NAME,
          referencedColumn: f.REFERENCED_COLUMN_NAME,
        })),
        estimatedRowCount: Number((countRows as Record<string, unknown>[])[0]?.TABLE_ROWS ?? 0),
      });
    }

    return result;
  } finally {
    await conn.end();
  }
}
