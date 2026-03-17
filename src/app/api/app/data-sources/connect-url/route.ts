import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { defaultQuotas } from "@/db/schema/plans";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { parseDatabaseUrl } from "@/lib/connectors/parse-url";
import { encryptJson } from "@/lib/encryption/aes";
import { testPostgresConnection, introspectPostgres } from "@/lib/connectors/postgresql";
import { testMySQLConnection, introspectMySQL } from "@/lib/connectors/mysql";

const connectUrlSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  url: z.string().min(10),
});

export const POST = withAuthRequired(async (req, { session, getCurrentPlan }) => {
  const body = await req.json();
  const parsed = connectUrlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = session.user.id;
  const { workspaceId, name, url } = parsed.data;

  // Parse URL
  const parseResult = parseDatabaseUrl(url);
  if ("error" in parseResult) {
    return NextResponse.json({ error: parseResult.error }, { status: 400 });
  }

  const { type, credentials } = parseResult;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check quota
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

  // Test connection
  const testResult = type === "postgresql"
    ? await testPostgresConnection(credentials)
    : await testMySQLConnection(credentials);

  if (!testResult.success) {
    return NextResponse.json(
      { error: `Connection failed: ${testResult.error}`, code: "CONNECTION_FAILED" },
      { status: 400 }
    );
  }

  // Introspect schema
  const schema = type === "postgresql"
    ? await introspectPostgres(credentials)
    : await introspectMySQL(credentials);

  // Encrypt credentials
  const encryptedConfig = encryptJson(credentials);

  // Create data source
  const displayName = name || `${type} — ${credentials.database}`;
  const [ds] = await db
    .insert(dataSources)
    .values({
      workspaceId,
      name: displayName,
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
