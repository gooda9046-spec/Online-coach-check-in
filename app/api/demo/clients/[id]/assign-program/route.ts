import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeClient } from "@/lib/demoSerialize";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/demo/clients/[id]/assign-program">
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body || (body.programId !== null && typeof body.programId !== "string")) {
    return NextResponse.json({ error: "Expected { programId: string | null }" }, { status: 400 });
  }

  const row = await prisma.client.update({
    where: { id },
    data: { programId: body.programId },
  });

  return NextResponse.json(serializeClient(row));
}
