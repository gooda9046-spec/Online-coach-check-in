import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { JoinForm } from "@/components/forms/JoinForm";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Accept Invite",
  description: "Accept your coach's invite to join Forge.",
};

export default async function JoinPage(props: PageProps<"/join/[code]">) {
  const { code } = await props.params;

  const user = await getCurrentUser();
  if (user) redirect("/product-demo");

  const invite = await prisma.invite.findUnique({
    where: { code },
    include: { client: { include: { coach: true } } },
  });

  if (!invite || invite.usedAt) {
    return (
      <PageShell eyebrow="Invite" title="This invite isn't valid">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
          This link is either invalid or has already been used. Ask your coach to send you a
          fresh invite link.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="You're invited"
      title={`Join Coach ${invite.client.coach.name} on Forge`}
      description={`You'll be joining as ${invite.client.name}.`}
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        <JoinForm code={code} />
      </div>
    </PageShell>
  );
}
