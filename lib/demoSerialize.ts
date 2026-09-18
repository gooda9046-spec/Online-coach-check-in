import type { Client as ClientRow, Program as ProgramRow } from "./generated/prisma/client";
import type { Client, Message, Program, ProgramDay, WeightEntry, WorkoutLogEntry } from "@/components/demo/types";

export function serializeProgram(row: ProgramRow): Program {
  return { id: row.id, name: row.name, days: row.days as unknown as ProgramDay[] };
}

export function serializeClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    userId: row.userId,
    programId: row.programId,
    adherence: row.adherence,
    status: row.status as Client["status"],
    nextCheckIn: row.nextCheckIn,
    weightUnit: row.weightUnit as Client["weightUnit"],
    weightLog: row.weightLog as unknown as WeightEntry[],
    workoutLogs: row.workoutLogs as unknown as WorkoutLogEntry[],
    messages: row.messages as unknown as Message[],
  };
}
