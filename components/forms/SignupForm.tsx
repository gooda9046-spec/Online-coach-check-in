"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent-bright" />
        <p className="text-foreground">
          This is a concept preview — account creation isn&apos;t wired up to a real backend yet.
        </p>
        <Button asChild>
          <Link href="/product-demo">
            Try the live product demo <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" type="text" placeholder="Alex Rivera" required />
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>
      <Button type="submit" className="w-full">
        Start Free Trial
      </Button>
      <p className="text-center text-xs text-muted">
        By continuing, you agree to Forge&apos;s Terms and Privacy Policy.
      </p>
    </form>
  );
}
