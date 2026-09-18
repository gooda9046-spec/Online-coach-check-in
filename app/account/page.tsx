import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { TwoFactorToggle } from "@/components/forms/TwoFactorToggle";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your Forge account security.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <PageShell eyebrow="Account" title="Account & security">
      <Link
        href="/product-demo"
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mb-6 rounded-xl border border-border bg-surface p-5">
        <p className="text-xs text-muted">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{user.name}</p>
        <p className="text-sm text-muted">{user.email}</p>
      </div>

      <TwoFactorToggle initialEnabled={user.twoFactorEnabled} />
    </PageShell>
  );
}
