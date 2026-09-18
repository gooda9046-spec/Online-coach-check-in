import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, invalidateAllSessions } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token || password.length < 8) {
    return NextResponse.json(
      { error: "A valid link and an 8+ character password are required." },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Request a new one." },
      { status: 410 }
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  // A password reset invalidates every other session — if someone else had
  // access via a stolen session, this locks them out too.
  await invalidateAllSessions(resetToken.userId);
  await createSession(resetToken.userId);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: resetToken.userId } });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
