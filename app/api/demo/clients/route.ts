import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeClient } from "@/lib/demoSerialize";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Coach adds a client to their roster — this creates the Client row and a
 * one-time invite code/link immediately; the client account itself doesn't
 * exist until they accept it via /api/auth/join. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    return NextResponse.json({ error: "Only coaches can add clients." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Expected { name: string }" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { name, initials: initialsOf(name), coachId: user.id, status: "New" },
  });
  const code = randomBytes(9).toString("base64url");
  await prisma.invite.create({ data: { code, clientId: client.id } });

  const inviteUrl = new URL(`/join/${code}`, request.url).toString();

  return NextResponse.json({ client: serializeClient(client), inviteUrl }, { status: 201 });
}
