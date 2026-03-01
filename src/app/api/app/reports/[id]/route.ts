import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { reports } from "@/db/schema/reports";
import { workspaces } from "@/db/schema/workspaces";
import { eq } from "drizzle-orm";

// GET — single report
export const GET = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [report] = await db.select().from(reports).where(eq(reports.id, id));
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, report.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(report);
});

// DELETE — delete report
export const DELETE = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [report] = await db.select().from(reports).where(eq(reports.id, id));
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, report.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(reports).where(eq(reports.id, id));
  return NextResponse.json({ success: true });
});
