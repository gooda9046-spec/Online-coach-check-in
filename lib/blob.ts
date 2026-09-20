import { put } from "@vercel/blob";

export class BlobNotConfiguredError extends Error {
  constructor() {
    super(
      "Photo storage isn't configured yet — enable Blob storage in your Vercel project (Storage tab) to turn this on."
    );
    this.name = "BlobNotConfiguredError";
  }
}

/** Uploads a file to Vercel Blob and returns its public URL. Throws
 * BlobNotConfiguredError (never a raw SDK error) if BLOB_READ_WRITE_TOKEN
 * isn't set, so callers can show one consistent, actionable message. */
export async function uploadPhoto(file: File, pathPrefix: string): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new BlobNotConfiguredError();
  }
  const key = `${pathPrefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const blob = await put(key, file, { access: "public" });
  return blob.url;
}
