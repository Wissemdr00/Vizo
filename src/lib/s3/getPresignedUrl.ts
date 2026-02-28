import { supabase, STORAGE_BUCKET } from "./client";

const getPresignedUrl = async (path: string) => {
  if (path[0] === "/") path = path.slice(1);

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 3600);

  if (error) throw new Error(`Failed to create signed URL: ${error.message}`);
  return data.signedUrl;
};

export default getPresignedUrl;
