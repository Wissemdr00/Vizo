import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { eq, and } from "drizzle-orm";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";

// GET — single data source with full schema + preview
export const GET = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [ds] = await db
    .select()
    .from(dataSources)
    .where(eq(dataSources.id, id));

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

  return NextResponse.json(ds);
});

// DELETE — remove data source (FR-3.8, FR-4.9)
export const DELETE = withAuthRequired(async (req, { session, params }) => {
  const { id } = (await params) as { id: string };

  const [ds] = await db
    .select()
    .from(dataSources)
    .where(eq(dataSources.id, id));

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

  // Delete storage file if file-based
  const fileTypes = ["csv", "excel", "json"];
  if (fileTypes.includes(ds.type) && ds.config?.fileUrl) {
    await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([ds.config.fileUrl]);
  }

  await db.delete(dataSources).where(eq(dataSources.id, id));

  return NextResponse.json({ success: true });
});
