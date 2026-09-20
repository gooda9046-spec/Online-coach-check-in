"use client";

import { useState, type FormEvent } from "react";
import { FileText, ListChecks, Plus } from "lucide-react";

import type { DemoView, Program, ProgramKind } from "../types";
import { makeId } from "../types";

export function ProgramsView({
  programs,
  onNavigate,
  onCreateProgram,
}: {
  programs: Program[];
  onNavigate: (view: DemoView) => void;
  onCreateProgram: (program: Program) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [kind, setKind] = useState<ProgramKind>("structured");
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const program: Program = { id: makeId(), name: trimmed, kind, days: [], entries: [] };
    onCreateProgram(program);
    setName("");
    setCreating(false);
    onNavigate({ name: "program", id: program.id });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Programs</h1>
          <p className="mt-1 text-sm text-muted">Reusable templates you can assign to any client.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-bright"
        >
          <Plus className="h-4 w-4" /> New Program
        </button>
      </div>

      {creating && (
        <form
          onSubmit={submit}
          className="mb-6 space-y-3 rounded-xl border border-accent/40 bg-accent/10 p-4"
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setKind("structured")}
              className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                kind === "structured"
                  ? "border-accent bg-surface text-foreground"
                  : "border-border bg-surface-2 text-muted"
              }`}
            >
              <ListChecks className="h-4 w-4 shrink-0" />
              <span>
                <span className="block font-medium">Structured</span>
                <span className="block text-xs text-muted">Days of exercises with sets/reps/load</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setKind("general")}
              className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                kind === "general"
                  ? "border-accent bg-surface text-foreground"
                  : "border-border bg-surface-2 text-muted"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>
                <span className="block font-medium">General</span>
                <span className="block text-xs text-muted">Freeform dated notes + photos</span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Program name, e.g. Off-Season Strength"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-bright"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <button
            key={program.id}
            type="button"
            onClick={() => onNavigate({ name: "program", id: program.id })}
            className="rounded-xl border border-border bg-surface p-5 text-left hover:border-accent/40"
          >
            <div className="flex items-center gap-2">
              {program.kind === "general" ? (
                <FileText className="h-3.5 w-3.5 text-accent-bright" />
              ) : (
                <ListChecks className="h-3.5 w-3.5 text-accent-bright" />
              )}
              <p className="font-semibold text-foreground">{program.name}</p>
            </div>
            <p className="mt-1 text-xs text-muted">
              {program.kind === "general"
                ? `${program.entries.length} ${program.entries.length === 1 ? "entry" : "entries"}`
                : `${program.days.length} ${program.days.length === 1 ? "day" : "days"}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
