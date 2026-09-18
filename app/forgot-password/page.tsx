import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/PageShell";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Forge account password.",
};

export default function ForgotPasswordPage() {
  return (
    <PageShell
      eyebrow="Password reset"
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-accent-bright hover:underline">
          Back to log in
        </Link>
      </p>
    </PageShell>
  );
}
