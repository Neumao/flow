/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkItemState" AS ENUM ('NEW', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'REWORK', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('STATE_CHANGE', 'BLOCKED', 'UNBLOCKED', 'REWORK', 'CANCELLED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phoneNumber",
DROP COLUMN "profileImageUrl";

-- CreateTable
CREATE TABLE "WorkItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" "WorkItemState" NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "reworkRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItemAuditEvent" (
    "id" TEXT NOT NULL,
    "workItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "fromState" "WorkItemState",
    "toState" "WorkItemState",
    "justification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkItemAuditEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkItemAuditEvent" ADD CONSTRAINT "WorkItemAuditEvent_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
