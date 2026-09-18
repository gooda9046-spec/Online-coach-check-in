import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const challengeId = typeof body?.challengeId === "string" ? body.challengeId : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!challengeId || !code) {
    return NextResponse.json({ error: "Expected { challengeId, code }" }, { status: 400 });
  }

  const challenge = await prisma.twoFactorCode.findUnique({
    where: { id: challengeId },
    include: { user: true },
  });

  if (!challenge || challenge.usedAt || challenge.expiresAt < new Date()) {
    return NextResponse.json({ error: "This code has expired. Log in again to get a new one." }, { status: 410 });
  }

  if (challenge.code !== code) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
  }

  await prisma.twoFactorCode.update({ where: { id: challengeId }, data: { usedAt: new Date() } });
  await createSession(challenge.userId);

  const { user } = challenge;
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
