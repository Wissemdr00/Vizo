import { supabase, STORAGE_BUCKET } from "./client";

interface UploadFields {
  url: string;
  fields: Record<string, string>;
}

const createStorageUploadUrl = async ({
  path,
}: {
  path: string;
  maxSize?: number;
  contentType?: string;
}): Promise<UploadFields> => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error)
    throw new Error(`Failed to create upload URL: ${error.message}`);

  return {
    url: data.signedUrl,
    fields: { token: data.token, path: data.path },
  };
};

export default createStorageUploadUrl;
