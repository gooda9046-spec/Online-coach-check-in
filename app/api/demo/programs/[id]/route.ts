import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProgram } from "@/lib/demoSerialize";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function PATCH(request: Request, ctx: RouteContext<"/api/demo/programs/[id]">) {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    return NextResponse.json({ error: "Only a coach can edit programs." }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.days)) {
    return NextResponse.json({ error: "Expected { days }" }, { status: 400 });
  }

  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing || existing.coachId !== user.id) {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }

  const row = await prisma.program.update({
    where: { id },
    data: { days: body.days as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeProgram(row));
}
