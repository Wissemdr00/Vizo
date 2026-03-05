import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { dataSources } from "@/db/schema/data-sources";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  aiProvider: z.enum(["openai", "anthropic","openrouter"]).optional(),
});

// GET — single workspace
export const GET = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [ws] = await db
    .select()
    .from(workspaces)
    .where(and(eq(workspaces.id, id), eq(workspaces.userId, session.user.id)));

  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get data source count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dataSources)
    .where(eq(dataSources.workspaceId, id));

  return NextResponse.json({ ...ws, dataSourceCount: count });
});

// PATCH — update workspace (name, description, aiProvider)
export const PATCH = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };
  const body = await req.json();
  const parsed = updateWorkspaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, id), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(workspaces)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(workspaces.id, id))
    .returning();

  return NextResponse.json(updated);
});

// DELETE — delete workspace (cascade)
export const DELETE = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, id), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(workspaces).where(eq(workspaces.id, id));
  return NextResponse.json({ success: true });
});
