import "server-only";
import { supabase, STORAGE_BUCKET } from "./client";

const uploadFromServer = async ({
  file,
  path,
  contentType,
}: {
  file: string;
  path: string;
  contentType?: string;
}) => {
  const normalizedPath = path.replace(/[^a-zA-Z0-9.\/]/g, "");

  const buffer = Buffer.from(file, "base64");

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(normalizedPath, buffer, {
      contentType: contentType || "application/octet-stream",
      upsert: true,
    });

  if (error) throw new Error(`File not uploaded: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(normalizedPath);

  return publicUrl;
};

export default uploadFromServer;
