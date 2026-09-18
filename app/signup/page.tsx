import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { SignupForm } from "@/components/forms/SignupForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Start Your Free Trial",
  description: "Start your 14-day free trial of Forge — no credit card required.",
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter — $29/mo",
  pro: "Pro — $79/mo",
  studio: "Studio / Team — $199/mo",
};

export default async function SignupPage(props: PageProps<"/signup">) {
  const user = await getCurrentUser();
  if (user) redirect("/product-demo");

  const searchParams = await props.searchParams;
  const planParam = typeof searchParams.plan === "string" ? searchParams.plan : undefined;
  const planLabel = planParam ? PLAN_LABELS[planParam] : undefined;

  return (
    <PageShell
      eyebrow="14-day free trial"
      title="Start your free trial"
      description="No credit card required. Cancel anytime."
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        {planLabel && (
          <div className="mb-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-bright">
            Selected plan: <strong>{planLabel}</strong>
          </div>
        )}
        <SignupForm />
      </div>
    </PageShell>
  );
}
