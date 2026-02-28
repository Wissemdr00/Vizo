import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { updateWorkspaceSchema } from "@/lib/validations/workspace.schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = withAuthRequired(async (req, context) => {
  const { session, params } = context;
  const { id } = (await params) as { id: string };
  const body = await req.json();

  const validation = updateWorkspaceSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.issues },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(workspaces)
    .set({
      ...validation.data,
      updatedAt: new Date(),
    })
    .where(
      and(eq(workspaces.id, id), eq(workspaces.userId, session.user.id))
    )
    .returning();

  if (!updated) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ workspace: updated });
});

export const DELETE = withAuthRequired(async (req, context) => {
  const { session, params } = context;
  const { id } = (await params) as { id: string };

  const [deleted] = await db
    .delete(workspaces)
    .where(
      and(eq(workspaces.id, id), eq(workspaces.userId, session.user.id))
    )
    .returning({ id: workspaces.id });

  if (!deleted) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
});
