export interface ClientStorageUploaderOptions {
  presignedRouteProvider: string;
}

export interface UploadFileOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}

export class ClientStorageUploader {
  private presignedRouteProvider: string;

  constructor(options: ClientStorageUploaderOptions) {
    this.presignedRouteProvider = options.presignedRouteProvider;
  }

  /**
   * Uploads a file to Supabase Storage using a signed upload URL
   */
  async uploadFile(file: File, options: UploadFileOptions = {}): Promise<string> {
    const { meta } = options;

    try {
      const createUploadUrlResponse = await fetch(this.presignedRouteProvider, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          ...meta,
        }),
      });

      if (!createUploadUrlResponse.ok) {
        const response = await createUploadUrlResponse.json();
        throw new Error(response.error || "Failed to get upload URL");
      }

      const uploadData = await createUploadUrlResponse.json();

      if (!uploadData.url) {
        throw new Error("No upload URL received");
      }

      // Upload directly to Supabase Storage signed URL
      const uploadResponse = await fetch(uploadData.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      return uploadData.publicUrl || uploadData.url;
    } catch (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
  }

  /**
   * Uploads multiple files concurrently
   */
  async uploadFiles(files: File[], options: UploadFileOptions = {}): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }
}

export const createStorageUploader = (presignedRouteProvider: string) => {
  return new ClientStorageUploader({ presignedRouteProvider });
};
