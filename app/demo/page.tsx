import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";
import { DemoForm } from "@/components/forms/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "See Forge in action — book a live walkthrough with our team.",
};

export default function DemoPage() {
  return (
    <PageShell
      eyebrow="Book a demo"
      title="See Forge in action"
      description="Tell us a bit about your coaching business and we'll set up a live walkthrough."
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        <DemoForm />
      </div>
    </PageShell>
  );
}
