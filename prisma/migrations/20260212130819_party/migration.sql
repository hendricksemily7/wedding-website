/*
  Warnings:

  - You are about to drop the column `email` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `partySize` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `mealChoices` on the `RSVP` table. All the data in the column will be lost.
  - Added the required column `partyId` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Guest_slug_key";

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "email",
DROP COLUMN "partySize",
DROP COLUMN "phone",
DROP COLUMN "slug",
ADD COLUMN     "partyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RSVP" DROP COLUMN "mealChoices",
ADD COLUMN     "mealChoice" "MealChoice";

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Party_slug_key" ON "Party"("slug");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
