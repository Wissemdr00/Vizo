import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { defaultQuotas } from "@/db/schema/plans";
import { eq, and, sql } from "drizzle-orm";
import { dbConnectionSchema } from "@/lib/validations/data-source.schema";
import { encryptJson } from "@/lib/encryption/aes";
import { testPostgresConnection, introspectPostgres } from "@/lib/connectors/postgresql";
import { testMySQLConnection, introspectMySQL } from "@/lib/connectors/mysql";

export const POST = withAuthRequired(async (req, { session, getCurrentPlan }) => {
  const body = await req.json();
  const parsed = dbConnectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = session.user.id;
  const { workspaceId, name, type, ...creds } = parsed.data;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check maxDataSources quota (FR-4.7)
  const plan = await getCurrentPlan();
  const quotas = plan?.quotas || defaultQuotas;
  const [{ count: dsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dataSources)
    .where(eq(dataSources.workspaceId, workspaceId));

  if (dsCount >= (quotas.maxDataSources ?? 999)) {
    return NextResponse.json(
      { error: "Data source limit reached. Upgrade your plan.", code: "QUOTA_EXCEEDED" },
      { status: 403 }
    );
  }

  // Test connection first (FR-4.3)
  const testResult = type === "postgresql"
    ? await testPostgresConnection(creds)
    : await testMySQLConnection(creds);

  if (!testResult.success) {
    return NextResponse.json(
      { error: `Connection failed: ${testResult.error}`, code: "CONNECTION_FAILED" },
      { status: 400 }
    );
  }

  // Introspect schema (FR-4.4)
  const schema = type === "postgresql"
    ? await introspectPostgres(creds)
    : await introspectMySQL(creds);

  // Encrypt credentials (FR-4.5)
  const encryptedConfig = encryptJson({
    host: creds.host,
    port: creds.port,
    database: creds.database,
    username: creds.username,
    password: creds.password,
    ssl: creds.ssl,
  });

  // Create data source record
  const [ds] = await db
    .insert(dataSources)
    .values({
      workspaceId,
      name,
      type,
      config: { connectionString: encryptedConfig },
      schema: { tables: schema, version: testResult.version },
    })
    .returning();

  return NextResponse.json({
    id: ds.id,
    name: ds.name,
    type: ds.type,
    schema: ds.schema,
    createdAt: ds.createdAt,
  }, { status: 201 });
});
