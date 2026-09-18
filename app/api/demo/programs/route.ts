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
  if (!body || typeof body.id !== "string" || typeof body.name !== "string" || !Array.isArray(body.days)) {
    return NextResponse.json({ error: "Expected { id, name, days }" }, { status: 400 });
  }

  const row = await prisma.program.create({
    data: { id: body.id, name: body.name, days: body.days as Prisma.InputJsonValue, coachId: user.id },
  });

  return NextResponse.json(serializeProgram(row), { status: 201 });
}
