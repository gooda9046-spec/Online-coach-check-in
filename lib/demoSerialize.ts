import type {
  Client as ClientRow,
  Program as ProgramRow,
  ProgressPhoto as ProgressPhotoRow,
} from "./generated/prisma/client";
import type {
  Client,
  GeneralEntry,
  Message,
  Program,
  ProgramDay,
  ProgressPhoto,
  WeightEntry,
  WorkoutLogEntry,
} from "@/components/demo/types";

export function serializeProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind as Program["kind"],
    days: row.days as unknown as ProgramDay[],
    entries: row.entries as unknown as GeneralEntry[],
  };
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

export function serializeProgressPhoto(row: ProgressPhotoRow): ProgressPhoto {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption,
    date: row.date,
    createdAt: row.createdAt.toISOString(),
  };
}
