/*
  Warnings:

  - Added the required column `durationMinutes` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "durationMinutes" INTEGER NOT NULL;
