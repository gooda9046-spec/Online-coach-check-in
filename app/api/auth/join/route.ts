import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

/** A client accepting a coach's invite link creates their account here —
 * this is the only way a client account comes into existence. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!code || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Email and an 8+ character password are required." },
      { status: 400 }
    );
  }

  const invite = await prisma.invite.findUnique({ where: { code }, include: { client: true } });
  if (!invite || invite.usedAt) {
    return NextResponse.json({ error: "This invite link is invalid or already used." }, { status: 410 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name: invite.client.name, email, passwordHash, role: "client" },
    });
    await tx.client.update({ where: { id: invite.clientId }, data: { userId: created.id } });
    await tx.invite.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
    return created;
  });

  await createSession(user.id);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
