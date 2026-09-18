import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeClient } from "@/lib/demoSerialize";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/demo/clients/[id]/assign-program">
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    return NextResponse.json({ error: "Only a coach can assign programs." }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body || (body.programId !== null && typeof body.programId !== "string")) {
    return NextResponse.json({ error: "Expected { programId: string | null }" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client || client.coachId !== user.id) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  if (body.programId) {
    const program = await prisma.program.findUnique({ where: { id: body.programId } });
    if (!program || program.coachId !== user.id) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }
  }

  const row = await prisma.client.update({
    where: { id },
    data: { programId: body.programId },
  });

  return NextResponse.json(serializeClient(row));
}
