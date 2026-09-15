"use client";

import { ArrowLeft } from "lucide-react";

import type { Client, DemoView, Program } from "../types";
import { WeightCheckIns } from "../WeightCheckIns";
import { MessageThread } from "../MessageThread";

export function ClientDetailView({
  client,
  programs,
  onNavigate,
  onAssignProgram,
  onLogWeight,
  onSendMessage,
}: {
  client: Client;
  programs: Program[];
  onNavigate: (view: DemoView) => void;
  onAssignProgram: (clientId: string, programId: string | null) => void;
  onLogWeight: (clientId: string, weight: number) => void;
  onSendMessage: (text: string) => void;
}) {
  const assignedProgram = programs.find((p) => p.id === client.programId) ?? null;

  return (
    <div>
      <button
        type="button"
        onClick={() => onNavigate({ name: "clients" })}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </button>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-lg font-semibold text-accent-bright">
          {client.initials}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{client.name}</h1>
          <p className="text-sm text-muted">Next check-in: {client.nextCheckIn}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Assigned program</p>
              <select
                value={client.programId ?? ""}
                onChange={(e) => onAssignProgram(client.id, e.target.value || null)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground"
              >
                <option value="">No program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {assignedProgram ? (
              <div className="space-y-3">
                {assignedProgram.days.map((day) => (
                  <div key={day.id} className="rounded-lg border border-border bg-surface-2 p-3">
                    <p className="mb-2 text-xs font-semibold text-accent-bright">{day.name}</p>
                    <ul className="space-y-1">
                      {day.exercises.map((ex) => (
                        <li key={ex.id} className="flex justify-between text-xs text-muted">
                          <span>{ex.name}</span>
                          <span>
                            {ex.sets}×{ex.reps} @ {ex.load}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                No program assigned yet — pick one from the dropdown above to see it appear here
                instantly, exactly as the client would see it in their app.
              </p>
            )}
          </div>

          <WeightCheckIns client={client} onLog={onLogWeight} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs text-muted">Adherence</p>
            <p className="mt-1 text-2xl font-bold text-accent-bright">{client.adherence}%</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs text-muted">Status</p>
            <p
              className={`mt-1 text-sm font-semibold ${
                client.status === "On track" ? "text-emerald-400" : "text-orange"
              }`}
            >
              {client.status}
            </p>
          </div>
          <div className="flex h-96 flex-col overflow-hidden rounded-xl border border-border bg-surface">
            <p className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
              Messages
            </p>
            <MessageThread
              messages={client.messages}
              viewerRole="coach"
              onSend={onSendMessage}
              placeholder="Reply to your client…"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
