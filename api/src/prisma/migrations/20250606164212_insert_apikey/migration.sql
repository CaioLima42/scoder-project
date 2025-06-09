/*
  Warnings:

  - A unique constraint covering the columns `[apikey]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[apikey]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apikey` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apikey` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "apikey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "apikey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_apikey_key" ON "Doctor"("apikey");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_apikey_key" ON "Patient"("apikey");
