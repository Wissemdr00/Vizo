import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { charts } from "@/db/schema/charts";
import { workspaces } from "@/db/schema/workspaces";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const createChartSchema = z.object({
  workspaceId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  type: z.enum(["bar", "line", "area", "scatter", "pie", "donut", "heatmap", "histogram", "box", "table"]),
  config: z.record(z.unknown()).default({}),
  data: z.array(z.record(z.unknown())).default([]),
  sql: z.string().optional(),
});

// POST — save chart to gallery
export const POST = withAuthRequired(async (req, { session }) => {
  const body = await req.json();
  const parsed = createChartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { workspaceId, ...chartData } = parsed.data;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, session.user.id)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const [chart] = await db
    .insert(charts)
    .values({ workspaceId, ...chartData })
    .returning();

  return NextResponse.json(chart, { status: 201 });
});

// GET — list charts for a workspace
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

  const chartList = await db
    .select()
    .from(charts)
    .where(eq(charts.workspaceId, workspaceId))
    .orderBy(desc(charts.createdAt));

  return NextResponse.json(chartList);
});
