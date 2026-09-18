import { ArrowRight } from "lucide-react";

import type { Client, DemoView, Program } from "../types";

export function DashboardView({
  coachName,
  clients,
  programs,
  onNavigate,
}: {
  coachName: string;
  clients: Client[];
  programs: Program[];
  onNavigate: (view: DemoView) => void;
}) {
  const joined = clients.filter((c) => c.userId).length;
  const needsAttention = clients.filter((c) => c.status === "Needs check-in");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Welcome back, {coachName}</h1>
          <p className="mt-1 text-sm text-muted">
            {clients.length} {clients.length === 1 ? "client" : "clients"} · {needsAttention.length} need
            attention
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate({ name: "programs" })}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-bright"
        >
          + New Program
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Clients</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{clients.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Joined their account</p>
          <p className="mt-1 text-2xl font-bold text-accent-bright">
            {joined}/{clients.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Programs</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{programs.length}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Needs attention</h2>
          <button
            type="button"
            onClick={() => onNavigate({ name: "clients" })}
            className="flex items-center gap-1 text-xs font-medium text-accent-bright hover:underline"
          >
            View all clients <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {clients.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
              No clients yet —{" "}
              <button
                type="button"
                onClick={() => onNavigate({ name: "clients" })}
                className="font-medium text-accent-bright hover:underline"
              >
                add your first one
              </button>
              .
            </p>
          )}
          {clients.length > 0 && needsAttention.length === 0 && (
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              Nobody needs attention right now — nice work.
            </p>
          )}
          {needsAttention.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => onNavigate({ name: "client", id: client.id })}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-surface p-4 text-left hover:border-accent/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-bright">
                  {client.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{client.name}</p>
                  <p className="text-xs text-muted">
                    {programs.find((p) => p.id === client.programId)?.name ?? "No program assigned"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-orange">{client.status}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
