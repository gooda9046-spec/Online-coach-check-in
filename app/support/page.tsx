import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Mail, MessageCircle } from "lucide-react";

import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Forge — contact support or browse common questions.",
};

const channels = [
  {
    icon: Mail,
    title: "Email support",
    description: "support@forgecoach.app",
    detail: "Typical response time: under 4 business hours on Starter and Pro, 1 hour on Studio/Team.",
  },
  {
    icon: MessageCircle,
    title: "In-app chat",
    description: "Available from your coach dashboard",
    detail: "Priority queue for Pro and Studio/Team plans.",
  },
  {
    icon: Clock,
    title: "Support hours",
    description: "Mon–Fri, 8am–8pm ET",
    detail: "Studio/Team plans include 24/7 priority support.",
  },
];

export default function SupportPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="How can we help?"
      description="Most questions are answered in our FAQ. For anything else, reach out below."
      narrow={false}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {channels.map((channel) => (
          <div key={channel.title} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
              <channel.icon className="h-5 w-5 text-accent-bright" aria-hidden />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">{channel.title}</h2>
            <p className="mt-1 text-sm text-foreground">{channel.description}</p>
            <p className="mt-2 text-sm text-muted">{channel.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15">
          <BookOpen className="h-5 w-5 text-accent-bright" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Looking for quick answers?</p>
          <p className="mt-1 text-sm text-muted">
            Check the{" "}
            <Link href="/#faq" className="font-medium text-accent-bright hover:underline">
              frequently asked questions
            </Link>{" "}
            on our homepage before reaching out — most billing and setup questions are covered
            there.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
