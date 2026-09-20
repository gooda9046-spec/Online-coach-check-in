export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load: string;
}

export interface ProgramDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export type ProgramKind = "structured" | "general";

export interface GeneralEntry {
  id: string;
  /** ISO date string (yyyy-mm-dd). */
  date: string;
  notes: string;
  photoUrl: string | null;
  addedBy: "coach" | "client";
  /** ISO datetime string. */
  createdAt: string;
}

export interface Program {
  id: string;
  name: string;
  kind: ProgramKind;
  days: ProgramDay[];
  entries: GeneralEntry[];
}

export type ClientStatus = "On track" | "Needs check-in" | "New";

export interface WeightEntry {
  id: string;
  /** ISO date string (yyyy-mm-dd). */
  date: string;
  weight: number;
}

export interface Message {
  id: string;
  from: "client" | "coach";
  text: string;
  /** ISO datetime string. */
  at: string;
}

export interface WorkoutLogEntry {
  id: string;
  /** ISO date string (yyyy-mm-dd). */
  date: string;
  exerciseName: string;
  weight: number;
  reps: number;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  caption: string | null;
  /** ISO date string (yyyy-mm-dd). */
  date: string;
  /** ISO datetime string. */
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  /** Null until the client accepts their invite and creates an account. */
  userId: string | null;
  programId: string | null;
  adherence: number;
  status: ClientStatus;
  nextCheckIn: string;
  weightUnit: "lb" | "kg";
  weightLog: WeightEntry[];
  workoutLogs: WorkoutLogEntry[];
  messages: Message[];
}

export type DemoView =
  | { name: "dashboard" }
  | { name: "clients" }
  | { name: "client"; id: string }
  | { name: "programs" }
  | { name: "program"; id: string };

/** Starter program templates given to every newly-signed-up coach. */
export function seedPrograms(): Program[] {
  return [
    {
      id: "p1",
      name: "Strength Block 4",
      kind: "structured",
      entries: [],
      days: [
        {
          id: "d1",
          name: "Day 1 — Push",
          exercises: [
            { id: "e1", name: "Bench Press", sets: 4, reps: "6", load: "78%" },
            { id: "e2", name: "Overhead Press", sets: 3, reps: "8", load: "65%" },
            { id: "e3", name: "Cable Fly", sets: 3, reps: "12", load: "RPE 8" },
          ],
        },
        {
          id: "d2",
          name: "Day 2 — Pull",
          exercises: [
            { id: "e4", name: "Deadlift", sets: 3, reps: "5", load: "82%" },
            { id: "e5", name: "Barbell Row", sets: 4, reps: "8", load: "70%" },
          ],
        },
      ],
    },
    {
      id: "p2",
      name: "Marathon Prep",
      kind: "structured",
      entries: [],
      days: [
        {
          id: "d3",
          name: "Day 1 — Easy Run",
          exercises: [{ id: "e6", name: "Zone 2 Run", sets: 1, reps: "45 min", load: "Easy" }],
        },
      ],
    },
  ];
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}
