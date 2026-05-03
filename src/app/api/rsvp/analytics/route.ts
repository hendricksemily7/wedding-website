import { prisma } from "@/lib/prisma";

function toOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toOptionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return null;
}

function inferDeviceType(clientDeviceType: unknown, userAgent: string): "mobile" | "web" {
  if (clientDeviceType === "mobile" || clientDeviceType === "web") {
    return clientDeviceType;
  }

  const mobilePattern = /iphone|ipad|ipod|android|mobile|silk|kindle/i;
  return mobilePattern.test(userAgent) ? "mobile" : "web";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userAgent = request.headers.get("user-agent") || "";

    const flowSessionId = toOptionalString(data.flowSessionId);
    const eventType = toOptionalString(data.eventType);

    if (!flowSessionId || !eventType) {
      return Response.json({ error: "flowSessionId and eventType are required" }, { status: 400 });
    }

    const step = toOptionalString(data.step);
    const guestSlug = toOptionalString(data.guestSlug);
    const partyId = toOptionalString(data.partyId);
    const pathname = toOptionalString(data.pathname);
    const viewportWidth = toOptionalNumber(data.viewportWidth);
    const guestIndex = toOptionalNumber(data.guestIndex);
    const totalGuests = toOptionalNumber(data.totalGuests);
    const metadata = typeof data.metadata === "object" && data.metadata !== null ? data.metadata : null;

    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const metadataJson = metadata ? JSON.stringify(metadata) : null;
    const deviceType = inferDeviceType(data.deviceType, userAgent);

    await prisma.$executeRaw`
      INSERT INTO "RSVPFlowEvent" (
        "id",
        "flowSessionId",
        "guestSlug",
        "partyId",
        "eventType",
        "step",
        "deviceType",
        "viewportWidth",
        "pathname",
        "guestIndex",
        "totalGuests",
        "metadata",
        "userAgent"
      )
      VALUES (
        ${id},
        ${flowSessionId},
        ${guestSlug},
        ${partyId},
        ${eventType},
        ${step},
        ${deviceType},
        ${viewportWidth},
        ${pathname},
        ${guestIndex},
        ${totalGuests},
        ${metadataJson}::jsonb,
        ${userAgent}
      )
    `;

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to store RSVP analytics event:", error);
    return Response.json({ error: "Failed to store RSVP analytics event" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const funnel = await prisma.$queryRaw<Array<{ deviceType: string; step: string | null; count: number }>>`
      SELECT "deviceType", "step", COUNT(*)::int AS "count"
      FROM "RSVPFlowEvent"
      WHERE "eventType" = 'respond_step_view'
      GROUP BY "deviceType", "step"
      ORDER BY "deviceType", "step"
    `;

    const keyEvents = await prisma.$queryRaw<Array<{ deviceType: string; eventType: string; count: number }>>`
      SELECT "deviceType", "eventType", COUNT(DISTINCT "flowSessionId")::int AS "count"
      FROM "RSVPFlowEvent"
      WHERE "eventType" IN ('lookup_view', 'lookup_submit', 'details_view', 'respond_flow_opened', 'submit_attempt', 'submit_success')
      GROUP BY "deviceType", "eventType"
      ORDER BY "deviceType", "eventType"
    `;

    return Response.json({ funnel, keyEvents });
  } catch (error) {
    console.error("Failed to fetch RSVP analytics summary:", error);
    return Response.json({ error: "Failed to fetch RSVP analytics summary" }, { status: 500 });
  }
}
