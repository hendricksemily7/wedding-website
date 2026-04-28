import { deleteTask, updateTask } from '@/db/planning';
import type { TaskOwner, TaskStatus } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return typeof value === 'string' ? new Date(value) : null;
}

function hasField(data: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(data, key);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json() as Record<string, unknown>;

    const task = await updateTask(id, {
      title: typeof data.title === 'string' ? data.title : undefined,
      details: hasField(data, 'details') ? (data.details as string | null) : undefined,
      status: hasField(data, 'status') ? data.status as TaskStatus | undefined : undefined,
      dueDate: hasField(data, 'dueDate') ? parseDate(data.dueDate) : undefined,
      owner: hasField(data, 'owner') ? data.owner as TaskOwner | undefined : undefined,
      vendorId: hasField(data, 'vendorId') ? (data.vendorId as string | null) : undefined,
      partyId: hasField(data, 'partyId') ? (data.partyId as string | null) : undefined,
    });

    return Response.json({ task });
  } catch (error) {
    console.error('Failed to update task:', error);
    return Response.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return Response.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}