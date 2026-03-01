import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { conversations } from "@/db/schema/conversations";
import { workspaces } from "@/db/schema/workspaces";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const createConversationSchema = z.object({
  workspaceId: z.string().uuid(),
  dataSourceId: z.string().uuid().optional(),
  title: z.string().max(100).optional(),
});

// POST — create conversation
export const POST = withAuthRequired(async (req, { session }) => {
  const body = await req.json();
  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { workspaceId, dataSourceId, title } = parsed.data;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const [conv] = await db
    .insert(conversations)
    .values({
      workspaceId,
      dataSourceId: dataSourceId || null,
      title: title || "New Analysis",
    })
    .returning();

  return NextResponse.json(conv, { status: 201 });
});

// GET — list conversations for a workspace
export const GET = withAuthRequired(async (req, { session }) => {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
  }

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const convs = await db
    .select()
    .from(conversations)
    .where(eq(conversations.workspaceId, workspaceId))
    .orderBy(desc(conversations.updatedAt));

  return NextResponse.json(convs);
});
