import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { dataSources } from "@/db/schema/data-sources";
import { workspaces } from "@/db/schema/workspaces";
import { defaultQuotas } from "@/db/schema/plans";
import { eq, and, sql } from "drizzle-orm";
import { fileUploadSchema } from "@/lib/validations/data-source.schema";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";
import { parseCSV } from "@/lib/parsers/csv";
import { parseJSON } from "@/lib/parsers/json";
import { parseExcel } from "@/lib/parsers/excel";

// POST — upload file and create data source
export const POST = withAuthRequired(async (req, { session, getCurrentPlan }) => {
  const body = await req.json();
  const parsed = fileUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const userId = session.user.id;
  const { workspaceId, fileName, fileType, sheetName } = parsed.data;

  // Verify workspace ownership
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)));
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  // Check maxDataSources quota (FR-3.6)
  const plan = await getCurrentPlan();
  const quotas = plan?.quotas || defaultQuotas;
  const [{ count: dsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dataSources)
    .where(eq(dataSources.workspaceId, workspaceId));

  if (dsCount >= (quotas.maxDataSources ?? 999)) {
    return NextResponse.json(
      { error: "Data source limit reached. Upgrade your plan.", code: "QUOTA_EXCEEDED" },
      { status: 403 }
    );
  }

  // Download file from Supabase Storage to parse
  const storagePath = `data-sources/${userId}/${workspaceId}/${fileName}`;
  const { data: fileData, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(storagePath);

  if (downloadError || !fileData) {
    return NextResponse.json(
      { error: "File not found in storage. Upload first." },
      { status: 400 }
    );
  }

  let schema;
  let previewRows;
  let extraMeta = {};

  try {
    if (fileType === "csv") {
      const text = await fileData.text();
      const result = parseCSV(text);
      schema = { columns: result.columns, rowCount: result.rowCount };
      previewRows = result.previewRows;
    } else if (fileType === "json") {
      const text = await fileData.text();
      const result = parseJSON(text);
      schema = { columns: result.columns, rowCount: result.rowCount };
      previewRows = result.previewRows;
    } else if (fileType === "excel") {
      const buffer = Buffer.from(await fileData.arrayBuffer());
      const { sheets, result } = await parseExcel(buffer, sheetName);
      if (!result) {
        // No sheet selected — return sheet list
        return NextResponse.json({ sheets, needsSheetSelection: true });
      }
      schema = { columns: result.columns, rowCount: result.rowCount };
      previewRows = result.previewRows;
      extraMeta = { sheetName };
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to parse file: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  // Create data source record
  const [ds] = await db
    .insert(dataSources)
    .values({
      workspaceId,
      name: fileName,
      type: fileType === "excel" ? "excel" : fileType,
      config: {
        fileUrl: storagePath,
        fileName,
        fileSizeBytes: fileData.size,
        ...extraMeta,
      },
      schema: { ...schema, previewRows },
    })
    .returning();

  return NextResponse.json(ds, { status: 201 });
});

// GET — list data sources for a workspace
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

  const sources = await db
    .select({
      id: dataSources.id,
      name: dataSources.name,
      type: dataSources.type,
      createdAt: dataSources.createdAt,
      config: dataSources.config,
    })
    .from(dataSources)
    .where(eq(dataSources.workspaceId, workspaceId));

  return NextResponse.json(sources);
});
