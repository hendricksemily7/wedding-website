import { prisma } from '@/lib/prisma';
import { generateSlug, getPartyById, updateParty, deleteParty, addGuestToParty, updateGuest, deleteGuest, createOrUpdateGuestRSVP } from '@/db/guests';
import type { MealChoice } from '@/generated/prisma/client';

// GET /api/admin/guests/[id] - Get a specific party
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const party = await getPartyById(id);

    if (!party) {
      return Response.json({ error: 'Party not found' }, { status: 404 });
    }

    return Response.json({ party });
  } catch (error) {
    console.error('Failed to fetch party:', error);
    return Response.json({ error: 'Failed to fetch party' }, { status: 500 });
  }
}

// PUT /api/admin/guests/[id] - Update a party, guest, or RSVP
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if this is a guest update, party update, or RSVP update
    if (data.type === 'guest') {
      // Update individual guest name
      const guest = await updateGuest(id, data.name);
      return Response.json({ guest });
    } else if (data.type === 'addGuest') {
      // Add a new guest to the party
      const guest = await addGuestToParty(id, data.name);
      return Response.json({ guest });
    } else if (data.type === 'rsvp') {
      // Update guest's RSVP (id is the guestId here)
      const rsvp = await createOrUpdateGuestRSVP(id, {
        attending: data.attending,
        mealChoice: data.mealChoice as MealChoice | undefined,
        dietaryNotes: data.dietaryNotes,
        needsShuttle: data.needsShuttle,
        comments: data.comments,
      });
      return Response.json({ rsvp });
    } else {
      // Update party details
      const party = await updateParty(id, {
        name: data.name,
      });
      return Response.json({ party });
    }
  } catch (error) {
    console.error('Failed to update:', error);
    return Response.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/admin/guests/[id] - Delete a party or guest
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (type === 'guest') {
      await deleteGuest(id);
    } else {
      await deleteParty(id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete:', error);
    return Response.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
