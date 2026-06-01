-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('ACTIVE', 'DONE');

-- AlterTable
ALTER TABLE "columns" ADD COLUMN     "is_done_column" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "tasks_is_archived_idx" ON "tasks"("is_archived");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");
