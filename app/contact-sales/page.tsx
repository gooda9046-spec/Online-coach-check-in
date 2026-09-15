import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";
import { ContactSalesForm } from "@/components/forms/ContactSalesForm";

export const metadata: Metadata = {
  title: "Talk to Sales",
  description: "Talk to Forge's sales team about a Studio or Team plan.",
};

export default function ContactSalesPage() {
  return (
    <PageShell
      eyebrow="Studio / Team"
      title="Talk to our sales team"
      description="For multi-coach studios and performance teams — let's find the right setup for your roster."
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        <ContactSalesForm />
      </div>
    </PageShell>
  );
}
