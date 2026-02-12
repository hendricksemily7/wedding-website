import { getPartyBySlug, updatePartyRSVPs } from '@/db/guests';
import type { MealChoice } from '@/generated/prisma/client';

// GET /api/rsvp/[guestName] - Get a party and its guests by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestName: string }> }
) {
  try {
    const { guestName } = await params;
    const slug = decodeURIComponent(guestName);
    const party = await getPartyBySlug(slug);

    if (!party) {
      return Response.json({ error: 'Party not found' }, { status: 404 });
    }

    return Response.json({ party });
  } catch (error) {
    console.error('Failed to fetch party:', error);
    return Response.json({ error: 'Failed to fetch party' }, { status: 500 });
  }
}

// PUT /api/rsvp/[guestName] - Update RSVPs for guests in a party
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ guestName: string }> }
) {
  try {
    const { guestName } = await params;
    const slug = decodeURIComponent(guestName);
    const party = await getPartyBySlug(slug);

    if (!party) {
      return Response.json({ error: 'Party not found' }, { status: 404 });
    }

    const data = await request.json();
    
    // Expect an array of guest RSVPs: { rsvps: [{ guestId, attending, mealChoice, ... }] }
    const rsvps = data.rsvps as Array<{
      guestId: string;
      attending: boolean;
      mealChoice?: MealChoice;
      dietaryNotes?: string;
      needsShuttle?: boolean;
      comments?: string;
    }>;

    await updatePartyRSVPs(rsvps);

    // Fetch updated party
    const updatedParty = await getPartyBySlug(slug);

    return Response.json({ party: updatedParty });
  } catch (error) {
    console.error('Failed to update RSVPs:', error);
    return Response.json({ error: 'Failed to update RSVPs' }, { status: 500 });
  }
}