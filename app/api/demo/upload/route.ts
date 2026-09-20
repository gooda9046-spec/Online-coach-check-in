import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { BlobNotConfiguredError, uploadPhoto } from "@/lib/blob";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Expected a file field named 'file'." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photo is too large (max 8MB)." }, { status: 413 });
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, or HEIC photos are supported." }, { status: 415 });
  }

  try {
    const url = await uploadPhoto(file, `uploads/${user.id}`);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof BlobNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Photo upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}
