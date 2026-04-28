import { deleteVendor, updateVendor } from '@/db/planning';
import type { PaymentStatus, VendorCategory } from '@/generated/prisma/client';

function parseDate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return typeof value === 'string' ? new Date(value) : null;
}

function parseAmount(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

    const vendor = await updateVendor(id, {
      name: typeof data.name === 'string' ? data.name : undefined,
      category: hasField(data, 'category') ? data.category as VendorCategory | undefined : undefined,
      contactName: hasField(data, 'contactName') ? (data.contactName as string | null) : undefined,
      email: hasField(data, 'email') ? (data.email as string | null) : undefined,
      phone: hasField(data, 'phone') ? (data.phone as string | null) : undefined,
      website: hasField(data, 'website') ? (data.website as string | null) : undefined,
      driveUrl: hasField(data, 'driveUrl') ? (data.driveUrl as string | null) : undefined,
      deliverables: hasField(data, 'deliverables') ? (data.deliverables as string | null) : undefined,
      notes: hasField(data, 'notes') ? (data.notes as string | null) : undefined,
      contractedAmount: hasField(data, 'contractedAmount') ? parseAmount(data.contractedAmount) : undefined,
      paymentStatus: hasField(data, 'paymentStatus') ? data.paymentStatus as PaymentStatus | undefined : undefined,
      dueDate: hasField(data, 'dueDate') ? parseDate(data.dueDate) : undefined,
    });

    return Response.json({ vendor });
  } catch (error) {
    console.error('Failed to update vendor:', error);
    return Response.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteVendor(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete vendor:', error);
    return Response.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}