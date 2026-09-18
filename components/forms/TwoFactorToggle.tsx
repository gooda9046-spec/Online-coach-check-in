"use client";

import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function TwoFactorToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [disabling, setDisabling] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enable() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/account/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't enable 2FA.");
      setEnabled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't enable 2FA.");
    } finally {
      setLoading(false);
    }
  }

  async function disable(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/account/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't disable 2FA.");
      setEnabled(false);
      setDisabling(false);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't disable 2FA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        {enabled ? (
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <ShieldOff className="h-5 w-5 shrink-0 text-muted" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
          <p className="mt-1 text-sm text-muted">
            {enabled
              ? "On — we'll email you a 6-digit code each time you log in."
              : "Off — logging in only needs your password."}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {enabled ? (
        disabling ? (
          <form onSubmit={disable} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="confirm-password">Confirm your password to disable</Label>
              <Input
                id="confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="outline" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Disable 2FA
              </Button>
              <Button type="button" variant="ghost" onClick={() => setDisabling(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" className="mt-4" onClick={() => setDisabling(true)}>
            Disable
          </Button>
        )
      ) : (
        <Button className="mt-4" onClick={enable} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Enable 2FA
        </Button>
      )}
    </div>
  );
}
