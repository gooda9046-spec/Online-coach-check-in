import { NextResponse } from "next/server";

import { requestPasswordReset } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  await requestPasswordReset(email, request.url);

  // Always the same response whether or not an account exists — don't leak
  // which emails are registered.
  return NextResponse.json({ ok: true });
}
