// src/app/rsvp/[guestName]/page.tsx
import RSVPDetailsClient from "./RSVPDetailsClient";

interface PageProps {
  params: { guestName: string };
}

export default async function RSVPDetailsPage({ params }: PageProps) {
  // Next.js wants you to "await" params (even if it's just a plain object)
  const { guestName } = await params;

  return <RSVPDetailsClient guestName={guestName} />;
}
