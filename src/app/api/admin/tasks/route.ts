import { createTask, getTasks } from '@/db/planning';
import type { TaskOwner, TaskStatus } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  return typeof value === 'string' && value ? new Date(value) : undefined;
}

export async function GET() {
  try {
    const tasks = await getTasks();
    return Response.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    const task = await createTask({
      title: data.title,
      details: data.details || undefined,
      status: (data.status as TaskStatus | undefined) ?? 'TODO',
      dueDate: parseDate(data.dueDate),
      owner: (data.owner as TaskOwner | undefined) ?? 'BOTH',
      vendorId: data.vendorId || undefined,
      partyId: data.partyId || undefined,
    });

    return Response.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return Response.json({ error: 'Failed to create task' }, { status: 500 });
  }
}