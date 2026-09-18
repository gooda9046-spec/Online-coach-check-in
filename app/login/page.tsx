import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { LoginForm } from "@/components/forms/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Forge coaching account.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/product-demo");

  return (
    <PageShell eyebrow="Welcome back" title="Log in to Forge">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent-bright hover:underline">
          Start your free trial
        </Link>
      </p>
    </PageShell>
  );
}
