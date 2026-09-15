import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeClient } from "@/lib/demoSerialize";
import type { Message } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/messages">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const from = body?.from === "coach" || body?.from === "client" ? body.from : null;
  if (!text || !from) {
    return NextResponse.json({ error: "Expected { from: 'coach'|'client', text: string }" }, { status: 400 });
  }

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

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
