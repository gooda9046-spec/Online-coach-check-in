import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession, createTwoFactorChallenge, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    const { challengeId } = await createTwoFactorChallenge(user.id, user.email);
    return NextResponse.json({ twoFactorRequired: true, challengeId });
  }

  await createSession(user.id);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
