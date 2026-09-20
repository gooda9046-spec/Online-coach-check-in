import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProgram } from "@/lib/demoSerialize";
import type { GeneralEntry } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/programs/[id]/entries">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
  const photoUrl = typeof body?.photoUrl === "string" ? body.photoUrl : null;
  if (!notes && !photoUrl) {
    return NextResponse.json({ error: "Add notes, a photo, or both." }, { status: 400 });
  }

  const program = await prisma.program.findUnique({ where: { id } });
  if (!program || program.kind !== "general") {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }

  const isOwner = program.coachId === user.id;
  const assignedClient = isOwner
    ? null
    : await prisma.client.findFirst({ where: { programId: id, userId: user.id } });
  if (!isOwner && !assignedClient) {
    return NextResponse.json({ error: "Not your program." }, { status: 403 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentEntries = program.entries as unknown as GeneralEntry[];
  const nextEntries: GeneralEntry[] = [
    ...currentEntries,
    {
      id: randomUUID(),
      date: today,
      notes,
      photoUrl,
      addedBy: user.role,
      createdAt: new Date().toISOString(),
    },
  ];

  const row = await prisma.program.update({
    where: { id },
    data: { entries: nextEntries as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeProgram(row));
}
