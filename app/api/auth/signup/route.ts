import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { seedPrograms } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

/** Coach signup — the only public account-creation path. Clients only ever
 * get an account via an invite link a coach generates (see /api/auth/join). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email, and an 8+ character password are required." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "coach" },
  });

  // Give a new coach a couple of starter program templates so their roster
  // isn't a completely blank slate — no fake clients, though.
  const starters = seedPrograms().slice(0, 2);
  await prisma.program.createMany({
    data: starters.map((p) => ({
      id: `${user.id}-${p.id}`,
      name: p.name,
      days: p.days as unknown as Prisma.InputJsonValue,
      coachId: user.id,
    })),
  });

  await createSession(user.id);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
