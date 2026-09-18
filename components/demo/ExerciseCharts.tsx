import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { WorkoutLogEntry } from "./types";
import { Sparkbars } from "./Sparkbars";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function groupByExercise(logs: WorkoutLogEntry[]): Map<string, WorkoutLogEntry[]> {
  const groups = new Map<string, WorkoutLogEntry[]>();
  for (const entry of logs) {
    const list = groups.get(entry.exerciseName) ?? [];
    list.push(entry);
    groups.set(entry.exerciseName, list);
  }
  for (const list of groups.values()) list.sort((a, b) => a.date.localeCompare(b.date));
  return groups;
}

export function ExerciseCharts({
  workoutLogs,
  weightUnit,
}: {
  workoutLogs: WorkoutLogEntry[];
  weightUnit: string;
}) {
  const grouped = groupByExercise(workoutLogs);
  const exerciseNames = [...grouped.keys()].sort();

  if (exerciseNames.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        No workout numbers logged yet — log what you lifted from an exercise on the Today tab and
        it&apos;ll start showing up here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exerciseNames.map((name) => {
        const entries = grouped.get(name)!;
        const latest = entries.at(-1)!;
        const first = entries[0]!;
        const delta = Math.round((latest.weight - first.weight) * 10) / 10;

        return (
          <div key={name} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-2xl font-bold text-foreground">
                  {latest.weight} <span className="text-sm font-normal text-muted">{weightUnit}</span>
                  <span className="ml-2 text-sm font-normal text-muted">× {latest.reps} reps</span>
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted">
                {entries.length > 1 ? (
                  <>
                    {delta === 0 ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : delta > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${delta} ${weightUnit}`} since first
                    log
                  </>
                ) : (
                  "First log"
                )}
              </span>
            </div>

            <Sparkbars
              points={entries.map((entry) => ({
                id: entry.id,
                label: formatDate(entry.date),
                value: entry.weight,
                tooltip: `${entry.weight} ${weightUnit} × ${entry.reps} reps on ${formatDate(entry.date)}`,
              }))}
              highlightId={latest.id}
            />
          </div>
        );
      })}
    </div>
  );
}
