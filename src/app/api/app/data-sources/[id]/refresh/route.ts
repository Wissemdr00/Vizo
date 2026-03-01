import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { eq } from "drizzle-orm";
import { decryptJson } from "@/lib/encryption/aes";
import { introspectPostgres } from "@/lib/connectors/postgresql";
import { introspectMySQL } from "@/lib/connectors/mysql";
import type { DatabaseCredentials } from "@/lib/connectors/types";

export const POST = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [ds] = await db.select().from(dataSources).where(eq(dataSources.id, id));
  if (!ds) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Verify ownership
  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, ds.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!["postgresql", "mysql"].includes(ds.type)) {
    return NextResponse.json({ error: "Only database sources can be refreshed" }, { status: 400 });
  }

  // Decrypt credentials
  const creds = decryptJson<DatabaseCredentials>(ds.config?.connectionString || "");

  // Re-introspect
  const schema = ds.type === "postgresql"
    ? await introspectPostgres(creds)
    : await introspectMySQL(creds);

  // Update
  await db
    .update(dataSources)
    .set({
      schema: { ...ds.schema as object, tables: schema },
      updatedAt: new Date(),
    })
    .where(eq(dataSources.id, id));

  return NextResponse.json({ tables: schema });
});
