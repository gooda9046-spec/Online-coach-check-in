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

export interface Program {
  id: string;
  name: string;
  days: ProgramDay[];
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

export interface Client {
  id: string;
  name: string;
  initials: string;
  programId: string | null;
  adherence: number;
  status: ClientStatus;
  nextCheckIn: string;
  weightUnit: "lb" | "kg";
  weightLog: WeightEntry[];
  messages: Message[];
}

export type DemoView =
  | { name: "dashboard" }
  | { name: "clients" }
  | { name: "client"; id: string }
  | { name: "programs" }
  | { name: "program"; id: string };

export type DemoPerspective = "coach" | "client";

export function seedPrograms(): Program[] {
  return [
    {
      id: "p1",
      name: "Strength Block 4",
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
      days: [
        {
          id: "d3",
          name: "Day 1 — Easy Run",
          exercises: [{ id: "e6", name: "Zone 2 Run", sets: 1, reps: "45 min", load: "Easy" }],
        },
      ],
    },
    {
      id: "p3",
      name: "Hypertrophy V2",
      days: [
        {
          id: "d4",
          name: "Day 1 — Legs",
          exercises: [
            { id: "e7", name: "Back Squat", sets: 4, reps: "8", load: "70%" },
            { id: "e8", name: "Leg Press", sets: 3, reps: "12", load: "RPE 8" },
          ],
        },
      ],
    },
  ];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function hoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function weightLog(entries: Array<[daysAgo: number, weight: number]>): WeightEntry[] {
  return entries.map(([offset, weight], i) => ({
    id: `w${i}-${offset}`,
    date: daysAgo(offset),
    weight,
  }));
}

function messageThread(
  entries: Array<[from: "client" | "coach", text: string, hoursOffset: number]>
): Message[] {
  return entries.map(([from, text, offset], i) => ({
    id: `m${i}-${offset}`,
    from,
    text,
    at: hoursAgo(offset),
  }));
}

export function seedClients(): Client[] {
  return [
    {
      id: "c1",
      name: "Maria Chen",
      initials: "MC",
      programId: "p1",
      adherence: 82,
      status: "On track",
      nextCheckIn: "Tue 4:00pm",
      weightUnit: "lb",
      weightLog: weightLog([
        [21, 162],
        [14, 161.4],
        [7, 160.8],
        [1, 160],
      ]),
      messages: messageThread([
        ["coach", "Welcome to Strength Block 4! Let me know how the first push day feels.", 68],
        ["client", "Bench felt heavy on the last set but I hit all my reps 💪", 66],
        ["coach", "Nice work — that's exactly where 78% should feel. Keep me posted on Day 2.", 65],
      ]),
    },
    {
      id: "c2",
      name: "Jordan Lee",
      initials: "JL",
      programId: "p2",
      adherence: 61,
      status: "On track",
      nextCheckIn: "Wed 9:00am",
      weightUnit: "lb",
      weightLog: weightLog([
        [20, 150],
        [13, 149],
        [6, 148.5],
        [2, 147.8],
      ]),
      messages: messageThread([
        ["client", "Is it okay to move my long run to Sunday this week? Work trip on Saturday.", 20],
        ["coach", "Totally fine — just keep Friday as an easy shakeout so the long run doesn't feel flat.", 19],
      ]),
    },
    {
      id: "c3",
      name: "Sam Okafor",
      initials: "SO",
      programId: null,
      adherence: 35,
      status: "Needs check-in",
      nextCheckIn: "—",
      weightUnit: "lb",
      weightLog: weightLog([[18, 210]]),
      messages: messageThread([
        ["client", "Hey, haven't had a program in a couple weeks — can we get something going?", 96],
      ]),
    },
    {
      id: "c4",
      name: "Priya Shah",
      initials: "PS",
      programId: "p3",
      adherence: 91,
      status: "On track",
      nextCheckIn: "Fri 5:30pm",
      weightUnit: "lb",
      weightLog: weightLog([
        [19, 145],
        [12, 146.2],
        [5, 147],
        [1, 148],
      ]),
      messages: messageThread([
        ["coach", "Great check-in this week, Priya. Legs day form looked clean in your last video.", 40],
        ["client", "Thanks! Quick one — should I keep pushing weight on leg press or hold steady?", 12],
      ]),
    },
  ];
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}
