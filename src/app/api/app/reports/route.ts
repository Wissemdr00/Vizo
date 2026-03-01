import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { workspaces } from "@/db/schema/workspaces";
import { eq, and, desc } from "drizzle-orm";

// GET — list reports for a workspace
export const GET = withAuthRequired(async (req, { session }) => {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
  }

  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const reportList = await db
    .select()
    .from(reports)
    .where(eq(reports.workspaceId, workspaceId))
    .orderBy(desc(reports.createdAt));

  return NextResponse.json(reportList);
});
