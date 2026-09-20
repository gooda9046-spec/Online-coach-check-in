"use client";

import { useRef, useState, type FormEvent } from "react";
import { BarChart3, Camera, Check, Loader2, MessageCircle, Sun, TrendingUp } from "lucide-react";

import type { Client, Exercise, Program } from "./types";
import { WeightCheckIns } from "./WeightCheckIns";
import { ExerciseCharts } from "./ExerciseCharts";
import { MessageThread } from "./MessageThread";
import { GeneralProgramFeed } from "./GeneralProgramFeed";
import { usePhotoUpload } from "./usePhotoUpload";

type ClientTab = "today" | "progress" | "charts" | "messages";

const tabs: { key: ClientTab; label: string; icon: typeof Sun }[] = [
  { key: "today", label: "Today", icon: Sun },
  { key: "progress", label: "Progress", icon: TrendingUp },
  { key: "charts", label: "Charts", icon: BarChart3 },
  { key: "messages", label: "Messages", icon: MessageCircle },
];

function ExerciseRow({
  exercise,
  loggedToday,
  onLog,
}: {
  exercise: Exercise;
  loggedToday: { weight: number; reps: number } | null;
  onLog: (exerciseName: string, weight: number, reps: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const w = Number(weight);
    const r = Number(reps);
    if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(r) || r <= 0) return;
    onLog(exercise.name, w, r);
    setOpen(false);
    setWeight("");
    setReps("");
  }

  return (
    <li className="border-b border-border/60 py-2 last:border-none">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{exercise.name}</span>
        <span className="text-muted">
          {exercise.sets}×{exercise.reps} @ {exercise.load}
        </span>
      </div>
      {loggedToday ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
          <Check className="h-3 w-3" /> Logged {loggedToday.weight} × {loggedToday.reps} reps today
        </p>
      ) : open ? (
        <form onSubmit={submit} className="mt-1.5 flex items-center gap-1.5">
          <input
            autoFocus
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            className="w-16 rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-foreground placeholder:text-muted"
          />
          <input
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="w-14 rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-foreground placeholder:text-muted"
          />
          <button type="submit" className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">
            Save
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 text-xs font-medium text-accent-bright hover:underline"
        >
          + Log what you did
        </button>
      )}
    </li>
  );
}

function SendPhotoButton({ onSend }: { onSend: (file: File) => Promise<boolean> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleFile(file: File) {
    setSending(true);
    const ok = await onSend(file);
    setSending(false);
    if (ok) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={sending}
        className="mt-2 flex w-full items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:border-accent/40 disabled:opacity-60"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : sent ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        {sent ? "Sent to your coach" : "Send a progress photo"}
      </button>
    </>
  );
}

export function ClientAppView({
  client,
  program,
  coachName,
  onLogWeight,
  onLogWorkout,
  onSendMessage,
  onAddEntry,
  onSendProgressPhoto,
}: {
  client: Client;
  program: Program | null;
  coachName: string;
  onLogWeight: (clientId: string, weight: number) => void;
  onLogWorkout: (clientId: string, exerciseName: string, weight: number, reps: number) => void;
  onSendMessage: (clientId: string, text: string) => void;
  onAddEntry: (programId: string, notes: string, photoUrl: string | null) => Promise<void>;
  onSendProgressPhoto: (clientId: string, url: string) => Promise<void>;
}) {
  const { upload, error: photoError } = usePhotoUpload();
  const [tab, setTab] = useState<ClientTab>("today");
  const firstName = client.name.split(" ")[0];
  const todayWorkout = program?.days[0] ?? null;
  const unreadFromCoach = client.messages.length > 0 && client.messages.at(-1)?.from === "coach";
  const today = new Date().toISOString().slice(0, 10);

  function loggedToday(exerciseName: string) {
    const entry = client.workoutLogs.find((w) => w.date === today && w.exerciseName === exerciseName);
    return entry ? { weight: entry.weight, reps: entry.reps } : null;
  }

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

            {program?.kind === "general" ? (
              <GeneralProgramFeed
                program={program}
                onAddEntry={(notes, photoUrl) => onAddEntry(program.id, notes, photoUrl)}
              />
            ) : todayWorkout ? (
              <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                <p className="text-xs font-semibold text-accent-bright">{todayWorkout.name}</p>
                <ul className="mt-2">
                  {todayWorkout.exercises.map((ex) => (
                    <ExerciseRow
                      key={ex.id}
                      exercise={ex}
                      loggedToday={loggedToday(ex.name)}
                      onLog={(exerciseName, weight, reps) =>
                        onLogWorkout(client.id, exerciseName, weight, reps)
                      }
                    />
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
            <SendPhotoButton
              onSend={async (file) => {
                const url = await upload(file);
                if (!url) return false;
                await onSendProgressPhoto(client.id, url);
                return true;
              }}
            />
            {photoError && <p className="mt-1.5 text-xs text-red-400">{photoError}</p>}
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

        {tab === "charts" && (
          <div>
            <p className="mb-4 text-lg font-semibold text-foreground">Your numbers</p>
            <ExerciseCharts workoutLogs={client.workoutLogs} weightUnit={client.weightUnit} />
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
