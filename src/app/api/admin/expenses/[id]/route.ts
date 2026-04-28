import { deleteExpense, updateExpense } from '@/db/planning';
import type { ExpenseCategory, PaymentStatus } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return typeof value === 'string' ? new Date(value) : null;
}

function parseAmount(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
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

    const expense = await updateExpense(id, {
      title: typeof data.title === 'string' ? data.title : undefined,
      category: hasField(data, 'category') ? data.category as ExpenseCategory | undefined : undefined,
      amount: hasField(data, 'amount') ? parseAmount(data.amount) : undefined,
      status: hasField(data, 'status') ? data.status as PaymentStatus | undefined : undefined,
      dueDate: hasField(data, 'dueDate') ? parseDate(data.dueDate) : undefined,
      paidDate: hasField(data, 'paidDate') ? parseDate(data.paidDate) : undefined,
      note: hasField(data, 'note') ? (data.note as string | null) : undefined,
      vendorId: hasField(data, 'vendorId') ? (data.vendorId as string | null) : undefined,
    });

    return Response.json({ expense });
  } catch (error) {
    console.error('Failed to update expense:', error);
    return Response.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteExpense(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    return Response.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}