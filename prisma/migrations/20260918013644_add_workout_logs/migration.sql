-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "workoutLogs" JSONB NOT NULL DEFAULT '[]';
