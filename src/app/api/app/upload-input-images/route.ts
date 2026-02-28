import withAuthRequired from "@/lib/auth/withAuthRequired";
import createStorageUploadUrl from "@/lib/s3/createS3UploadFields";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";
import { NextResponse } from "next/server";

interface UploadImageRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const POST = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const { fileName, fileType, fileSize }: UploadImageRequest =
      await req.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, fileSize" },
        { status: 400 }
      );
    }

    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const fileUuid = crypto.randomUUID();
    const storagePath = `public/users/${session.user.id}/images/${fileUuid}.${fileExtension}`;

    const uploadData = await createStorageUploadUrl({
      path: storagePath,
      maxSize: fileSize,
      contentType: fileType,
    });

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    return NextResponse.json({
      url: uploadData.url,
      fields: uploadData.fields,
      publicUrl,
    });
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
});

