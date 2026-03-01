import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { workspaces } from "@/db/schema/workspaces";
import { defaultQuotas } from "@/db/schema/plans";
import { eq, and } from "drizzle-orm";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";
import { z } from "zod";

const uploadRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  fileName: z.string().min(1),
  fileSizeBytes: z.number().int().positive(),
  contentType: z.string().default("application/octet-stream"),
});

// POST — get presigned upload URL (client uploads directly to Supabase)
export const POST = withAuthRequired(async (req, { session, getCurrentPlan }) => {
  const body = await req.json();
  const parsed = uploadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = session.user.id;
  const { workspaceId, fileName, fileSizeBytes, contentType } = parsed.data;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check file size quota (FR-3.7)
  const plan = await getCurrentPlan();
  const quotas = plan?.quotas || defaultQuotas;
  const maxBytes = (quotas.maxFileUploadSizeMb ?? 5) * 1024 * 1024;
  if (fileSizeBytes > maxBytes) {
    return NextResponse.json(
      {
        error: `File exceeds ${quotas.maxFileUploadSizeMb}MB limit. Upgrade your plan for larger uploads.`,
        code: "FILE_TOO_LARGE",
        maxMb: quotas.maxFileUploadSizeMb,
      },
      { status: 413 }
    );
  }

  const storagePath = `data-sources/${userId}/${workspaceId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error) {
    return NextResponse.json(
      { error: `Failed to create upload URL: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    storagePath,
  });
});
