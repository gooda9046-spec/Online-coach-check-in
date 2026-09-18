import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/invite">) {
  const user = await getCurrentUser();
  if (!user || user.role !== "coach") {
    return NextResponse.json({ error: "Only a coach can view invite links." }, { status: 403 });
  }

  const { id } = await ctx.params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client || client.coachId !== user.id) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  if (client.userId) {
    return NextResponse.json({ inviteUrl: null, joined: true });
  }

  const invite = await prisma.invite.findUnique({ where: { clientId: id } });
  if (!invite || invite.usedAt) {
    return NextResponse.json({ inviteUrl: null, joined: false });
  }

  const inviteUrl = new URL(`/join/${invite.code}`, request.url).toString();
  return NextResponse.json({ inviteUrl, joined: false });
}
