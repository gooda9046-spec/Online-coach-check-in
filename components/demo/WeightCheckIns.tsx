"use client";

import { useState, type FormEvent } from "react";
import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";

import type { Client } from "./types";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function WeightCheckIns({
  client,
  onLog,
}: {
  client: Client;
  onLog: (clientId: string, weight: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [weight, setWeight] = useState("");

  const entries = [...client.weightLog].sort((a, b) => a.date.localeCompare(b.date));
  const latest = entries.at(-1);
  const first = entries[0];
  const delta = latest && first ? Math.round((latest.weight - first.weight) * 10) / 10 : 0;

  const values = entries.map((e) => e.weight);
  const min = Math.min(...values, latest?.weight ?? 0);
  const max = Math.max(...values, latest?.weight ?? 0);
  const range = Math.max(max - min, 1);

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = Number(weight);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onLog(client.id, parsed);
    setWeight("");
    setAdding(false);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Weight check-ins</p>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-accent-bright hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Log check-in
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={submit} className="mb-4 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3">
          <input
            autoFocus
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Weight (${client.weightUnit})`}
            className="w-32 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted"
          />
          <span className="text-xs text-muted">as of today</span>
          <button
            type="submit"
            className="ml-auto rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-bright"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="rounded-md px-2 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      )}

      {entries.length === 0 ? (
        <p className="text-sm text-muted">No check-ins logged yet.</p>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {latest?.weight} <span className="text-sm font-normal text-muted">{client.weightUnit}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                {delta === 0 ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : delta > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} ${client.weightUnit}`} since first
                check-in
              </p>
            </div>
          </div>

          <div className="flex h-16 gap-1.5">
            {entries.map((entry) => {
              const heightPct = ((entry.weight - min) / range) * 70 + 30;
              const isLatest = entry.id === latest?.id;
              return (
                <div
                  key={entry.id}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <div
                    className={`w-full rounded-t-sm ${
                      isLatest ? "bg-accent-bright" : "bg-border"
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${entry.weight} ${client.weightUnit} on ${formatDate(entry.date)}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {entries.map((entry) => (
              <span key={entry.id} className="flex-1 text-center text-[10px] text-muted">
                {formatDate(entry.date)}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
