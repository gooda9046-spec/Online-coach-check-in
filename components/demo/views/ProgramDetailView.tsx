"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";

import type { DemoView, Program, ProgramDay } from "../types";
import { makeId } from "../types";

function AddExerciseForm({ onAdd }: { onAdd: (name: string, sets: number, reps: string, load: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [load, setLoad] = useState("RPE 8");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-accent-bright hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Add exercise
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name.trim(), Number(sets) || 1, reps.trim() || "1", load.trim() || "—");
        setName("");
        setSets("3");
        setReps("10");
        setLoad("RPE 8");
        setOpen(false);
      }}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exercise name"
        className="min-w-[140px] flex-1 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted"
      />
      <input
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        placeholder="Sets"
        className="w-14 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-foreground"
      />
      <input
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="Reps"
        className="w-16 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-foreground"
      />
      <input
        value={load}
        onChange={(e) => setLoad(e.target.value)}
        placeholder="Load"
        className="w-20 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-foreground"
      />
      <button type="submit" className="rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-white">
        Add
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-md px-2 py-1.5 text-xs text-muted hover:text-foreground"
      >
        Cancel
      </button>
    </form>
  );
}

export function ProgramDetailView({
  program,
  onNavigate,
  onUpdateProgram,
}: {
  program: Program;
  onNavigate: (view: DemoView) => void;
  onUpdateProgram: (program: Program) => void;
}) {
  const [addingDay, setAddingDay] = useState(false);
  const [dayName, setDayName] = useState("");

  function updateDay(dayId: string, updater: (day: ProgramDay) => ProgramDay) {
    onUpdateProgram({
      ...program,
      days: program.days.map((d) => (d.id === dayId ? updater(d) : d)),
    });
  }

  function removeDay(dayId: string) {
    onUpdateProgram({ ...program, days: program.days.filter((d) => d.id !== dayId) });
  }

  function addDay(e: FormEvent) {
    e.preventDefault();
    const trimmed = dayName.trim();
    if (!trimmed) return;
    onUpdateProgram({
      ...program,
      days: [...program.days, { id: makeId(), name: trimmed, exercises: [] }],
    });
    setDayName("");
    setAddingDay(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => onNavigate({ name: "programs" })}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to programs
      </button>

      <h1 className="mb-6 text-xl font-semibold text-foreground">{program.name}</h1>

      <div className="space-y-4">
        {program.days.map((day) => (
          <div key={day.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{day.name}</p>
              <button
                type="button"
                onClick={() => removeDay(day.id)}
                aria-label={`Remove ${day.name}`}
                className="text-muted hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="mb-3 space-y-1.5">
              {day.exercises.map((ex) => (
                <li
                  key={ex.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
                >
                  <span className="text-foreground">{ex.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">
                      {ex.sets}×{ex.reps} @ {ex.load}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${ex.name}`}
                      onClick={() =>
                        updateDay(day.id, (d) => ({
                          ...d,
                          exercises: d.exercises.filter((e) => e.id !== ex.id),
                        }))
                      }
                      className="text-muted hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
              {day.exercises.length === 0 && (
                <li className="text-xs text-muted">No exercises yet.</li>
              )}
            </ul>

            <AddExerciseForm
              onAdd={(name, sets, reps, load) =>
                updateDay(day.id, (d) => ({
                  ...d,
                  exercises: [...d.exercises, { id: makeId(), name, sets, reps, load }],
                }))
              }
            />
          </div>
        ))}

        {addingDay ? (
          <form
            onSubmit={addDay}
            className="flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4"
          >
            <input
              autoFocus
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              placeholder="Day name, e.g. Day 3 — Legs"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-bright"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAddingDay(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAddingDay(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted hover:border-accent/40 hover:text-accent-bright"
          >
            <Plus className="h-4 w-4" /> Add day
          </button>
        )}
      </div>
    </div>
  );
}
