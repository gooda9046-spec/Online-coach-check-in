import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeClient } from "@/lib/demoSerialize";
import type { WeightEntry } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/weight">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const weight = typeof body?.weight === "number" ? body.weight : NaN;
  if (!Number.isFinite(weight) || weight <= 0) {
    return NextResponse.json({ error: "Expected { weight: number }" }, { status: 400 });
  }

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10);
  const currentLog = existing.weightLog as unknown as WeightEntry[];
  const nextLog: WeightEntry[] = [
    ...currentLog.filter((entry) => entry.date !== today),
    { id: randomUUID(), date: today, weight },
  ];

  const row = await prisma.client.update({
    where: { id },
    data: { weightLog: nextLog as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeClient(row));
}
