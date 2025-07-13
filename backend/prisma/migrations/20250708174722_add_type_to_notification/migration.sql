/*
  Warnings:

  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'APPOINTMENT', 'PAYMENT', 'VERIFICATION', 'MESSAGE', 'REVIEW', 'REMINDER', 'ARTICLE', 'SYSTEM');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
