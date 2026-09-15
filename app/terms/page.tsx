import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Forge's terms of service.",
};

const sections = [
  {
    title: "1. Using Forge",
    body: "By creating an account, you agree to use Forge only for lawful coaching-related purposes and to keep your login credentials secure. You're responsible for the content you upload, including workout programs, nutrition plans, and messages to clients.",
  },
  {
    title: "2. Client relationships",
    body: "Forge is a tool for managing your coaching business. We are not a party to the coaching relationship between you and your clients, and we don't provide medical, nutritional, or fitness advice ourselves.",
  },
  {
    title: "3. Subscriptions and billing",
    body: "Paid plans renew automatically each billing cycle until cancelled. You can cancel at any time from your account settings; access continues until the end of the current billing period.",
  },
  {
    title: "4. Data ownership",
    body: "You own the data you and your clients put into Forge. If you cancel your account, you can export your client and program data before it is deleted from our systems.",
  },
  {
    title: "5. Termination",
    body: "We may suspend or terminate accounts that violate these terms, misuse the platform, or pose a security risk to other users.",
  },
  {
    title: "6. Changes to these terms",
    body: "We'll notify active accounts by email before any material change to these terms takes effect.",
  },
];

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of Service" narrow={false}>
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
