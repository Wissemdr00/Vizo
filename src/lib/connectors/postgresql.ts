import "server-only";
import postgres from "postgres";
import type { ConnectionTestResult, DatabaseCredentials, TableSchema } from "./types";

function createConnection(creds: DatabaseCredentials) {
  return postgres({
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
}

export async function testPostgresConnection(
  creds: DatabaseCredentials
): Promise<ConnectionTestResult> {
  const sql = createConnection(creds);
  try {
    const [row] = await sql`SELECT version()`;
    return { success: true, version: row.version };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  } finally {
    await sql.end();
  }
}

export async function introspectPostgres(
  creds: DatabaseCredentials
): Promise<TableSchema[]> {
  const sql = createConnection(creds);
  try {
    // Get tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const result: TableSchema[] = [];

    for (const { table_name } of tables) {
      // Columns
      const columns = await sql`
        SELECT c.column_name, c.data_type, c.is_nullable,
          CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_pk
        FROM information_schema.columns c
        LEFT JOIN (
          SELECT ku.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage ku
            ON tc.constraint_name = ku.constraint_name
          WHERE tc.table_name = ${table_name}
            AND tc.constraint_type = 'PRIMARY KEY'
        ) pk ON pk.column_name = c.column_name
        WHERE c.table_name = ${table_name}
          AND c.table_schema = 'public'
        ORDER BY c.ordinal_position
      `;

      // Foreign keys
      const fks = await sql`
        SELECT
          kcu.column_name,
          ccu.table_name AS referenced_table,
          ccu.column_name AS referenced_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = ${table_name}
          AND tc.constraint_type = 'FOREIGN KEY'
      `;

      // Row count estimate
      const [countRow] = await sql`
        SELECT reltuples::bigint AS estimate
        FROM pg_class
        WHERE relname = ${table_name}
      `;

      result.push({
        name: table_name,
        columns: columns.map((c: Record<string, unknown>) => ({
          name: c.column_name as string,
          type: c.data_type as string,
          nullable: c.is_nullable === "YES",
          isPrimaryKey: c.is_pk === true,
        })),
        foreignKeys: fks.map((f: Record<string, unknown>) => ({
          column: f.column_name as string,
          referencedTable: f.referenced_table as string,
          referencedColumn: f.referenced_column as string,
        })),
        estimatedRowCount: Number(countRow?.estimate ?? 0),
      });
    }

    return result;
  } finally {
    await sql.end();
  }
}
