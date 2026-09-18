import type { Metadata } from "next";

import { PageShell } from "@/components/PageShell";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Forge account.",
};

export default async function ResetPasswordPage(props: PageProps<"/reset-password/[token]">) {
  const { token } = await props.params;

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  const valid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  if (!valid) {
    return (
      <PageShell eyebrow="Password reset" title="This link isn't valid">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
          This reset link is invalid or has expired. Request a new one from the login page.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Password reset" title="Choose a new password">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <ResetPasswordForm token={token} />
      </div>
    </PageShell>
  );
}
