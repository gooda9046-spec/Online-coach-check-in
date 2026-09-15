import { prisma } from "./prisma";
import { seedClients, seedPrograms } from "@/components/demo/types";
import type { Prisma } from "./generated/prisma/client";

/** First request after a fresh database populates it with the same demo
 * data the local-state version shipped with — keeps the beta's starting
 * point identical to what we already validated. */
export async function ensureSeeded(): Promise<void> {
  const existing = await prisma.program.count();
  if (existing > 0) return;

  const programs = seedPrograms();
  const clients = seedClients();

  await prisma.$transaction([
    ...programs.map((p) =>
      prisma.program.create({
        data: { id: p.id, name: p.name, days: p.days as unknown as Prisma.InputJsonValue },
      })
    ),
    ...clients.map((c) =>
      prisma.client.create({
        data: {
          id: c.id,
          name: c.name,
          initials: c.initials,
          programId: c.programId,
          adherence: c.adherence,
          status: c.status,
          nextCheckIn: c.nextCheckIn,
          weightUnit: c.weightUnit,
          weightLog: c.weightLog as unknown as Prisma.InputJsonValue,
          messages: c.messages as unknown as Prisma.InputJsonValue,
        },
      })
    ),
  ]);
}
