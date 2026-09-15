import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeProgram } from "@/lib/demoSerialize";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function PATCH(request: Request, ctx: RouteContext<"/api/demo/programs/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.days)) {
    return NextResponse.json({ error: "Expected { days }" }, { status: 400 });
  }

  const row = await prisma.program.update({
    where: { id },
    data: { days: body.days as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeProgram(row));
}
