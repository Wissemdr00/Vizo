import withAuthRequired from "@/lib/auth/withAuthRequired";
import createStorageUploadUrl from "@/lib/s3/createS3UploadFields";
import { supabase, STORAGE_BUCKET } from "@/lib/s3/client";
import { NextResponse } from "next/server";

interface UploadAvatarRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const POST = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const { fileName, fileType, fileSize }: UploadAvatarRequest =
      await req.json();

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set",
        },
        { status: 500 }
      );
    }

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, fileSize" },
        { status: 400 }
      );
    }

    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed for avatars" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum allowed size is 5MB" },
        { status: 400 }
      );
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const fileUuid = crypto.randomUUID();
    const storagePath = `public/users/${session.user.id}/avatars/${fileUuid}.${fileExtension}`;

    const uploadData = await createStorageUploadUrl({
      path: storagePath,
      maxSize: maxSize,
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
    console.error("Error creating upload URL for avatar:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
});
