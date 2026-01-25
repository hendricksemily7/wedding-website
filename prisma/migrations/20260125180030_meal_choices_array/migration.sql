/*
  Warnings:

  - You are about to drop the column `mealChoice` on the `RSVP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RSVP" DROP COLUMN "mealChoice",
ADD COLUMN     "mealChoices" JSONB;
