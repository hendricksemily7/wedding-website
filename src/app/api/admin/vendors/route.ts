import { createVendor, getVendors } from '@/db/planning';
import type { PaymentStatus, VendorCategory } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  return typeof value === 'string' && value ? new Date(value) : undefined;
}

function parseAmount(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET() {
  try {
    const vendors = await getVendors();
    return Response.json({ vendors });
  } catch (error) {
    console.error('Failed to fetch vendors:', error);
    return Response.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.category) {
      return Response.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const vendor = await createVendor({
      name: data.name,
      category: data.category as VendorCategory,
      contactName: data.contactName || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      website: data.website || undefined,
      driveUrl: data.driveUrl || undefined,
      deliverables: data.deliverables || undefined,
      notes: data.notes || undefined,
      contractedAmount: parseAmount(data.contractedAmount),
      paymentStatus: (data.paymentStatus as PaymentStatus | undefined) ?? 'PENDING',
      dueDate: parseDate(data.dueDate),
    });

    return Response.json({ vendor }, { status: 201 });
  } catch (error) {
    console.error('Failed to create vendor:', error);
    return Response.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}