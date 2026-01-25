import { getAllRSVPs, getAllGuests, createGuest } from '@/db/guests';

// GET /api/rsvp - Get all RSVPs (or all guests with their RSVP status)
export async function GET(request: Request) {
  try {
    const guests = await getAllGuests();
    return Response.json({ guests });
  } catch (error) {
    console.error('Failed to fetch guests:', error);
    return Response.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}

// POST /api/rsvp - Create a new guest
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const guest = await createGuest(data);
    return Response.json({ guest }, { status: 201 });
  } catch (error) {
    console.error('Failed to create guest:', error);
    return Response.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}