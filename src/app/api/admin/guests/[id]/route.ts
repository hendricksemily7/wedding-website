import { prisma } from '@/lib/prisma';

// GET /api/admin/guests/[id] - Get a specific guest
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: { rsvp: true },
    });

    if (!guest) {
      return Response.json({ error: 'Guest not found' }, { status: 404 });
    }

    return Response.json({ guest });
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    return Response.json({ error: 'Failed to fetch guest' }, { status: 500 });
  }
}

// PUT /api/admin/guests/[id] - Update a guest
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const guest = await prisma.guest.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        partySize: data.partySize || 1,
      },
      include: { rsvp: true },
    });

    return Response.json({ guest });
  } catch (error) {
    console.error('Failed to update guest:', error);
    return Response.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}

// DELETE /api/admin/guests/[id] - Delete a guest
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.guest.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete guest:', error);
    return Response.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
