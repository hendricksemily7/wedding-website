-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "isWeddingParty" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RSVP" ADD COLUMN     "attendingRehearsalDinner" BOOLEAN;
