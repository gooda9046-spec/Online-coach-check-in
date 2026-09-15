import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ensureSeeded } from "@/lib/seedDemoData";
import { serializeClient, serializeProgram } from "@/lib/demoSerialize";

export async function GET() {
  await ensureSeeded();

  const [clients, programs] = await Promise.all([
    prisma.client.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.program.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return NextResponse.json({
    clients: clients.map(serializeClient),
    programs: programs.map(serializeProgram),
  });
}
