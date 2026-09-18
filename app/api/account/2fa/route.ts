import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const action = body?.action;

  if (action === "enable") {
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
    return NextResponse.json({ twoFactorEnabled: true });
  }

  if (action === "disable") {
    const password = typeof body?.password === "string" ? body.password : "";
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false } });
    return NextResponse.json({ twoFactorEnabled: false });
  }

  return NextResponse.json({ error: "Expected { action: 'enable' | 'disable' }" }, { status: 400 });
}
