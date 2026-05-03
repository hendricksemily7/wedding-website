"use client";

type RSVPDeviceType = "mobile" | "web";

const FLOW_SESSION_KEY = "rsvp_flow_session_id";

function getFlowSessionId(): string {
  const existing = window.sessionStorage.getItem(FLOW_SESSION_KEY);
  if (existing) {
    return existing;
  }

  const nextId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.sessionStorage.setItem(FLOW_SESSION_KEY, nextId);
  return nextId;
}

function getDeviceType(): RSVPDeviceType {
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "web";
}

export type RSVPEventPayload = {
  eventType: string;
  step?: string;
  guestSlug?: string;
  partyId?: string;
  guestIndex?: number;
  totalGuests?: number;
  metadata?: Record<string, unknown>;
};

export async function trackRSVPEvent(payload: RSVPEventPayload): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const body = {
    flowSessionId: getFlowSessionId(),
    eventType: payload.eventType,
    step: payload.step,
    guestSlug: payload.guestSlug,
    partyId: payload.partyId,
    deviceType: getDeviceType(),
    viewportWidth: window.innerWidth,
    pathname: window.location.pathname,
    guestIndex: payload.guestIndex,
    totalGuests: payload.totalGuests,
    metadata: payload.metadata,
  };

  try {
    await fetch("/api/rsvp/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Ignore analytics failures so RSVP UX is never blocked.
  }
}
