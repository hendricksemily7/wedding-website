import { getAllParties, createParty } from '@/db/guests';

// GET /api/rsvp - Get all parties with their guests and RSVP status
export async function GET(request: Request) {
  try {
    const parties = await getAllParties();
    return Response.json({ parties });
  } catch (error) {
    console.error('Failed to fetch parties:', error);
    return Response.json({ error: 'Failed to fetch parties' }, { status: 500 });
  }
}

// POST /api/rsvp - Create a new party with guests
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Support both single guest name and array of guest names
    const guestNames = data.guestNames || [data.name];
    
    const party = await createParty({
      name: data.name, // Party display name
      guestNames,
    });
    
    return Response.json({ party }, { status: 201 });
  } catch (error) {
    console.error('Failed to create party:', error);
    return Response.json({ error: 'Failed to create party' }, { status: 500 });
  }
}