import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { charts } from "@/db/schema/charts";
import { workspaces } from "@/db/schema/workspaces";
import { eq } from "drizzle-orm";

// DELETE — remove chart from gallery
export const DELETE = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [chart] = await db.select().from(charts).where(eq(charts.id, id));
  if (!chart) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [ws] = await db
    .select({ userId: workspaces.userId })
    .from(workspaces)
    .where(eq(workspaces.id, chart.workspaceId));
  if (!ws || ws.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(charts).where(eq(charts.id, id));
  return NextResponse.json({ success: true });
});
