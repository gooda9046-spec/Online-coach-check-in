import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeClient } from "@/lib/demoSerialize";
import type { WorkoutLogEntry } from "@/components/demo/types";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/workout-log">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const exerciseName = typeof body?.exerciseName === "string" ? body.exerciseName.trim() : "";
  const weight = typeof body?.weight === "number" ? body.weight : NaN;
  const reps = typeof body?.reps === "number" ? body.reps : NaN;
  if (!exerciseName || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(reps) || reps <= 0) {
    return NextResponse.json(
      { error: "Expected { exerciseName: string, weight: number, reps: number }" },
      { status: 400 }
    );
  }

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const allowed = existing.coachId === user.id || existing.userId === user.id;
  if (!allowed) return NextResponse.json({ error: "Not your client." }, { status: 403 });

  const today = new Date().toISOString().slice(0, 10);
  const currentLogs = existing.workoutLogs as unknown as WorkoutLogEntry[];
  const nextLogs: WorkoutLogEntry[] = [
    ...currentLogs.filter((entry) => !(entry.date === today && entry.exerciseName === exerciseName)),
    { id: randomUUID(), date: today, exerciseName, weight, reps },
  ];

  const row = await prisma.client.update({
    where: { id },
    data: { workoutLogs: nextLogs as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json(serializeClient(row));
}
