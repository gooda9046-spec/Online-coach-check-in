import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProgram } from "@/lib/demoSerialize";
import type { Prisma } from "@/lib/generated/prisma/client.js";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    return NextResponse.json({ error: "Only a coach can create programs." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const kind = body?.kind === "general" ? "general" : "structured";
  if (!body || typeof body.id !== "string" || typeof body.name !== "string") {
    return NextResponse.json({ error: "Expected { id, name, kind? }" }, { status: 400 });
  }
  if (kind === "structured" && !Array.isArray(body.days)) {
    return NextResponse.json({ error: "Expected { days } for a structured program." }, { status: 400 });
  }

  const row = await prisma.program.create({
    data: {
      id: body.id,
      name: body.name,
      kind,
      days: (kind === "structured" ? body.days : []) as Prisma.InputJsonValue,
      entries: [] as unknown as Prisma.InputJsonValue,
      coachId: user.id,
    },
  });

  return NextResponse.json(serializeProgram(row), { status: 201 });
}
