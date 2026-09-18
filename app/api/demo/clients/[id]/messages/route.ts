import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeClient } from "@/lib/demoSerialize";
import type { Message } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/messages">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Expected { text: string }" }, { status: 400 });
  }

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  // Derive who's sending from the authenticated session — never trust a
  // client-supplied "from" field, since either party could impersonate the
  // other otherwise.
  const from: Message["from"] | null =
    existing.coachId === user.id ? "coach" : existing.userId === user.id ? "client" : null;
  if (!from) return NextResponse.json({ error: "Not your client." }, { status: 403 });

  const currentMessages = existing.messages as unknown as Message[];
  const nextMessages: Message[] = [
    ...currentMessages,
    { id: randomUUID(), from, text, at: new Date().toISOString() },
  ];

  const row = await prisma.client.update({
    where: { id },
    data: { messages: nextMessages as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeClient(row));
}
