import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { conversations } from "@/db/schema/conversations";
import { messages as messagesTable } from "@/db/schema/messages";
import { workspaces } from "@/db/schema/workspaces";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

// GET — single conversation with messages
export const GET = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Verify ownership
  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, conv.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Load messages for this conversation
  const msgs = await db
    .select({
      id: messagesTable.id,
      role: messagesTable.role,
      content: messagesTable.content,
      meta: messagesTable.meta,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));

  return NextResponse.json({ ...conv, messages: msgs });
});

// PATCH — rename conversation
export const PATCH = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };
  const body = await req.json();
  const parsed = z.object({ title: z.string().min(1).max(100) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, conv.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(conversations)
    .set({ title: parsed.data.title, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning();

  return NextResponse.json(updated);
});

// DELETE — delete conversation (cascades messages)
export const DELETE = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, conv.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(conversations).where(eq(conversations.id, id));
  return NextResponse.json({ success: true });
});
