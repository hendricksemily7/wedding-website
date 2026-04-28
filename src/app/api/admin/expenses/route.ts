import { createExpense, getExpenses } from '@/db/planning';
import type { ExpenseCategory, PaymentStatus } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  return typeof value === 'string' && value ? new Date(value) : undefined;
}

function parseAmount(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const expenses = await getExpenses();
    return Response.json({ expenses });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return Response.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const amount = parseAmount(data.amount);

    if (!data.title || !data.category || amount === null) {
      return Response.json({ error: 'Title, category, and amount are required' }, { status: 400 });
    }

    const expense = await createExpense({
      title: data.title,
      category: data.category as ExpenseCategory,
      amount,
      status: (data.status as PaymentStatus | undefined) ?? 'PENDING',
      dueDate: parseDate(data.dueDate),
      paidDate: parseDate(data.paidDate),
      note: data.note || undefined,
      vendorId: data.vendorId || undefined,
    });

    return Response.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return Response.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}