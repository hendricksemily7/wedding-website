-- Create RSVP flow analytics table for funnel and drop-off tracking
CREATE TABLE "RSVPFlowEvent" (
  "id" TEXT NOT NULL,
  "flowSessionId" TEXT NOT NULL,
  "guestSlug" TEXT,
  "partyId" TEXT,
  "eventType" TEXT NOT NULL,
  "step" TEXT,
  "deviceType" TEXT NOT NULL,
  "viewportWidth" INTEGER,
  "pathname" TEXT,
  "guestIndex" INTEGER,
  "totalGuests" INTEGER,
  "metadata" JSONB,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "RSVPFlowEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RSVPFlowEvent_createdAt_idx" ON "RSVPFlowEvent"("createdAt");
CREATE INDEX "RSVPFlowEvent_deviceType_createdAt_idx" ON "RSVPFlowEvent"("deviceType", "createdAt");
CREATE INDEX "RSVPFlowEvent_eventType_createdAt_idx" ON "RSVPFlowEvent"("eventType", "createdAt");
CREATE INDEX "RSVPFlowEvent_step_createdAt_idx" ON "RSVPFlowEvent"("step", "createdAt");
CREATE INDEX "RSVPFlowEvent_flowSessionId_createdAt_idx" ON "RSVPFlowEvent"("flowSessionId", "createdAt");
