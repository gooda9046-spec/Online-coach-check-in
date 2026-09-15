import type { Metadata } from "next";
import { Target, Users, Zap } from "lucide-react";

import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built Forge — a coaching platform built by and for coaches.",
};

const values = [
  {
    icon: Target,
    title: "Built for coaches first",
    description:
      "Every feature ships because a working coach asked for it — not because it looked good on a roadmap slide.",
  },
  {
    icon: Zap,
    title: "Less software, more coaching",
    description:
      "If a tool doesn't save you time or help you retain clients, it doesn't belong in Forge.",
  },
  {
    icon: Users,
    title: "Clients are part of the product",
    description:
      "A coaching platform only works if clients actually open it. We design the client app with the same care as the coach dashboard.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Forge"
      title="A coaching platform built by coaches"
      description="We started Forge after watching too many good coaches lose hours a week to spreadsheets, DMs, and five different apps that didn't talk to each other."
      narrow={false}
    >
      <div className="space-y-6 text-base leading-relaxed text-muted">
        <p>
          Forge began in 2023 as a side project to help a handful of online strength coaches
          replace their patchwork of spreadsheets, group chats, and payment links with a single
          system. Word spread inside coaching communities, and today Forge supports coaches
          running everything from solo online practices to multi-coach studios.
        </p>
        <p>
          We&apos;re a small, coach-obsessed team. Most of what we build starts as a direct
          request from someone using the product — which is why the roadmap looks less like a
          typical SaaS company&apos;s and more like a running list of things coaches actually
          asked for.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
              <value.icon className="h-5 w-5 text-accent-bright" aria-hidden />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">{value.title}</h2>
            <p className="mt-2 text-sm text-muted">{value.description}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
