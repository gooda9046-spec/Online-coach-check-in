"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Log in failed.");
      if (data.twoFactorRequired) {
        setChallengeId(data.challengeId);
        setLoading(false);
        return;
      }
      router.push("/product-demo");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Log in failed.");
      setLoading(false);
    }
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't verify that code.");
      router.push("/product-demo");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't verify that code.");
      setLoading(false);
    }
  }

  if (challengeId) {
    return (
      <form className="space-y-5" onSubmit={submitCode}>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-4 text-center">
          <Mail className="h-6 w-6 text-accent-bright" />
          <p className="text-sm text-foreground">
            We emailed a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
          </p>
        </div>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <div>
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Verify & Log In
        </Button>
        <button
          type="button"
          onClick={() => {
            setChallengeId(null);
            setCode("");
            setError(null);
          }}
          className="w-full text-center text-xs text-muted hover:text-foreground"
        >
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-5" onSubmit={submitPassword}>
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs font-medium text-accent-bright hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Log In
      </Button>
    </form>
  );
}
