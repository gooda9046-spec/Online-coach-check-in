"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

import type { Client, DemoView, Program } from "../types";
import { WeightCheckIns } from "../WeightCheckIns";
import { ExerciseCharts } from "../ExerciseCharts";
import { MessageThread } from "../MessageThread";

function InviteBanner({ clientId, hasJoined }: { clientId: string; hasJoined: boolean }) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (hasJoined) return;
    fetch(`/api/demo/clients/${clientId}/invite`)
      .then((res) => res.json())
      .then((data) => setInviteUrl(data.inviteUrl ?? null))
      .catch(() => setInviteUrl(null));
  }, [clientId, hasJoined]);

  if (hasJoined || !inviteUrl) return null;

  return (
    <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
      <p className="text-sm font-semibold text-foreground">Waiting for them to join</p>
      <p className="mt-1 text-xs text-muted">
        Send this link so they can create their account and link up with you.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={inviteUrl}
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(inviteUrl).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-bright"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

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

      <InviteBanner clientId={client.id} hasJoined={Boolean(client.userId)} />

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

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Exercise progression</p>
            <ExerciseCharts workoutLogs={client.workoutLogs} weightUnit={client.weightUnit} />
          </div>
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
