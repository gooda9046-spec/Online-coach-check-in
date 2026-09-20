import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProgressPhoto } from "@/lib/demoSerialize";

// Coach-only visibility, by design — a client can upload (POST) but this
// GET never returns anything to them, even for their own client record.
export async function GET(_request: Request, ctx: RouteContext<"/api/demo/clients/[id]/photos">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await ctx.params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client || client.coachId !== user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const photos = await prisma.progressPhoto.findMany({
    where: { clientId: id },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ photos: photos.map(serializeProgressPhoto) });
}

export async function POST(request: Request, ctx: RouteContext<"/api/demo/clients/[id]/photos">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  const caption = typeof body?.caption === "string" && body.caption.trim() ? body.caption.trim() : null;
  if (!url) {
    return NextResponse.json({ error: "Expected { url: string, caption? }" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  const allowed = client.coachId === user.id || client.userId === user.id;
  if (!allowed) return NextResponse.json({ error: "Not your client." }, { status: 403 });

  const today = new Date().toISOString().slice(0, 10);
  const photo = await prisma.progressPhoto.create({
    data: { clientId: id, url, caption, date: today },
  });

  return NextResponse.json(serializeProgressPhoto(photo), { status: 201 });
}
