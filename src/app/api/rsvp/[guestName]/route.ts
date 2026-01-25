import { getGuestBySlug, createOrUpdateRSVP } from '@/db/guests';

// GET /api/rsvp/[guestName] - Get a guest's RSVP by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ guestName: string }> }
) {
  try {
    const { guestName } = await params;
    const slug = decodeURIComponent(guestName);
    const guest = await getGuestBySlug(slug);

    if (!guest) {
      return Response.json({ error: 'Guest not found' }, { status: 404 });
    }

    return Response.json({ guest });
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    return Response.json({ error: 'Failed to fetch guest' }, { status: 500 });
  }
}

// PUT /api/rsvp/[guestName] - Update a guest's RSVP
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ guestName: string }> }
) {
  try {
    const { guestName } = await params;
    const slug = decodeURIComponent(guestName);
    const guest = await getGuestBySlug(slug);

    if (!guest) {
      return Response.json({ error: 'Guest not found' }, { status: 404 });
    }

    const data = await request.json();
    const rsvp = await createOrUpdateRSVP(guest.id, data);

    return Response.json({ rsvp });
  } catch (error) {
    console.error('Failed to update RSVP:', error);
    return Response.json({ error: 'Failed to update RSVP' }, { status: 500 });
  }
}