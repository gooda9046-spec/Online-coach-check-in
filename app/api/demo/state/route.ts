import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeClient, serializeProgram } from "@/lib/demoSerialize";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (user.role === "coach") {
    const [clients, programs] = await Promise.all([
      prisma.client.findMany({ where: { coachId: user.id }, orderBy: { createdAt: "asc" } }),
      prisma.program.findMany({ where: { coachId: user.id }, orderBy: { createdAt: "asc" } }),
    ]);
    return NextResponse.json({
      role: "coach" as const,
      me: { id: user.id, name: user.name },
      clients: clients.map(serializeClient),
      programs: programs.map(serializeProgram),
    });
  }

  const client = await prisma.client.findUnique({ where: { userId: user.id }, include: { coach: true } });
  if (!client) {
    return NextResponse.json({ error: "No client profile linked to this account." }, { status: 404 });
  }
  const program = client.programId
    ? await prisma.program.findUnique({ where: { id: client.programId } })
    : null;

  return NextResponse.json({
    role: "client" as const,
    me: { id: user.id, name: user.name },
    coachName: client.coach.name,
    client: serializeClient(client),
    program: program ? serializeProgram(program) : null,
  });
}
