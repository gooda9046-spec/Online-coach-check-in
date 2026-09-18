"use client";

import { useState } from "react";
import { MessageCircle, Sun, TrendingUp } from "lucide-react";

import type { Client, Program } from "./types";
import { WeightCheckIns } from "./WeightCheckIns";
import { MessageThread } from "./MessageThread";

type ClientTab = "today" | "progress" | "messages";

const tabs: { key: ClientTab; label: string; icon: typeof Sun }[] = [
  { key: "today", label: "Today", icon: Sun },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "messages", label: "Messages", icon: MessageCircle },
];

export function ClientAppView({
  client,
  program,
  coachName,
  onLogWeight,
  onSendMessage,
}: {
  client: Client;
  program: Program | null;
  coachName: string;
  onLogWeight: (clientId: string, weight: number) => void;
  onSendMessage: (clientId: string, text: string) => void;
}) {
  const [tab, setTab] = useState<ClientTab>("today");
  const firstName = client.name.split(" ")[0];
  const todayWorkout = program?.days[0] ?? null;
  const unreadFromCoach = client.messages.length > 0 && client.messages.at(-1)?.from === "coach";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-[2rem] border border-border bg-surface glow">
      <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] text-muted">
        <span>9:41</span>
        <span>Forge</span>
      </div>

      <div className="min-h-[480px] flex-1 px-5 pb-3">
        {tab === "today" && (
          <div>
            <p className="text-lg font-semibold text-foreground">Hey {firstName} 👋</p>
            <p className="mb-4 text-sm text-muted">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
            </p>

            {todayWorkout ? (
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                <p className="text-xs font-semibold text-accent-bright">{todayWorkout.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {todayWorkout.exercises.map((ex) => (
                    <li key={ex.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{ex.name}</span>
                      <span className="text-muted">
                        {ex.sets}×{ex.reps} @ {ex.load}
                      </span>
                    </li>
                  ))}
                  {todayWorkout.exercises.length === 0 && (
                    <li className="text-sm text-muted">No exercises added yet.</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
                No program assigned yet. Message your coach if you think that&apos;s a mistake.
              </div>
            )}

            <button
              type="button"
              onClick={() => setTab("progress")}
              className="mt-4 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:border-accent/40"
            >
              📈 Log today&apos;s weight
            </button>
            <button
              type="button"
              onClick={() => setTab("messages")}
              className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:border-accent/40"
            >
              💬 Message your coach
            </button>
          </div>
        )}

        {tab === "progress" && (
          <div>
            <p className="mb-4 text-lg font-semibold text-foreground">Your progress</p>
            <WeightCheckIns client={client} onLog={onLogWeight} />
          </div>
        )}

        {tab === "messages" && (
          <div className="flex h-[440px] flex-col">
            <p className="mb-2 text-lg font-semibold text-foreground">{coachName}</p>
            <div className="flex-1 overflow-hidden rounded-xl border border-border">
              <MessageThread
                messages={client.messages}
                viewerRole="client"
                onSend={(text) => onSendMessage(client.id, text)}
                placeholder="Ask your coach a question…"
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex border-t border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              tab === t.key ? "text-accent-bright" : "text-muted"
            }`}
          >
            <t.icon className="h-5 w-5" aria-hidden />
            {t.label}
            {t.key === "messages" && unreadFromCoach && tab !== "messages" && (
              <span className="absolute right-[calc(50%-22px)] top-2 h-1.5 w-1.5 rounded-full bg-accent-bright" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
