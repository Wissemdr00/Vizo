import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { defaultQuotas } from "@/db/schema/plans";
import { createWorkspaceSchema } from "@/lib/validations/workspace.schema";
import { eq, sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = withAuthRequired(async (req, context) => {
  const { session } = context;

  const result = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      description: workspaces.description,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
      dataSourceCount: sql<number>`(SELECT COUNT(*) FROM data_sources WHERE data_sources."workspaceId" = workspaces.id)`,
      conversationCount: sql<number>`(SELECT COUNT(*) FROM conversations WHERE conversations."workspaceId" = workspaces.id)`,
    })
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .orderBy(desc(workspaces.updatedAt));

  return NextResponse.json({ workspaces: result });
});

export const POST = withAuthRequired(async (req, context) => {
  const { session, getCurrentPlan } = context;
  const body = await req.json();

  const validation = createWorkspaceSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.issues },
      { status: 400 }
    );
  }

  // Enforce maxWorkspaces quota (FR-2.4)
  const plan = await getCurrentPlan();
  const maxWorkspaces = plan?.quotas?.maxWorkspaces ?? defaultQuotas.maxWorkspaces;

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id));

  if (Number(count) >= maxWorkspaces) {
    return NextResponse.json(
      {
        error: `Workspace limit reached (${maxWorkspaces}). Upgrade your plan for more workspaces.`,
        code: "QUOTA_EXCEEDED",
        upgradeUrl: "/app/plan",
      },
      { status: 403 }
    );
  }

  const { name, description } = validation.data;

  const [workspace] = await db
    .insert(workspaces)
    .values({
      userId: session.user.id,
      name,
      description: description || null,
    })
    .returning();

  return NextResponse.json({ workspace }, { status: 201 });
});
