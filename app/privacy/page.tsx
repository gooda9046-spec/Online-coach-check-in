import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Forge collects, uses, and protects your data.",
};

const sections = [
  {
    title: "1. What we collect",
    body: "Account details (name, email, business info), the programs and content you create, and usage data like login activity and feature usage. Clients using the companion app share workout logs, food journals, and habit check-ins that you as their coach can view.",
  },
  {
    title: "2. How we use it",
    body: "To operate and improve Forge, process payments, provide support, and send account-related communications. We don't sell client or coach data to third parties.",
  },
  {
    title: "3. Wearable and health data",
    body: "If you connect Apple Health, Google Fit, or Wear OS, we only sync the specific metrics you authorize (steps, calories, workouts) and only share them with the coach a client is connected to.",
  },
  {
    title: "4. Data retention",
    body: "We retain account data for as long as your account is active. After cancellation, data is retained for 30 days to allow export, then deleted.",
  },
  {
    title: "5. Your rights",
    body: "You can request a copy of your data or ask us to delete it at any time by contacting support.",
  },
  {
    title: "6. Security",
    body: "Data is encrypted in transit and at rest. Access to client data is limited to the coach a client is connected to and authorized Forge staff for support purposes.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy" narrow={false}>
      <div className="mb-10 rounded-xl border border-orange/30 bg-orange/10 px-4 py-3 text-sm text-orange">
        This page is example content for a product concept, not a reviewed legal agreement.
      </div>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-xs text-muted">Last updated: September 2026.</p>
    </PageShell>
  );
}
