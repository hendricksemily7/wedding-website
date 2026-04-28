import { prisma } from '@/lib/prisma';
import type {
  ExpenseCategory,
  PaymentStatus,
  TaskOwner,
  TaskStatus,
  VendorCategory,
} from '@/generated/prisma/client';

export async function getVendors() {
  return prisma.vendor.findMany({
    include: {
      expenses: {
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
      },
      tasks: {
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ dueDate: 'asc' }, { name: 'asc' }],
  });
}

export async function createVendor(data: {
  name: string;
  category: VendorCategory;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  driveUrl?: string;
  deliverables?: string;
  notes?: string;
  contractedAmount?: number;
  paymentStatus?: PaymentStatus;
  dueDate?: Date;
}) {
  return prisma.vendor.create({
    data: {
      name: data.name,
      category: data.category,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      driveUrl: data.driveUrl,
      deliverables: data.deliverables,
      notes: data.notes,
      contractedAmount: data.contractedAmount,
      paymentStatus: data.paymentStatus,
      dueDate: data.dueDate,
    },
    include: {
      expenses: true,
      tasks: true,
    },
  });
}

export async function updateVendor(
  id: string,
  data: {
    name?: string;
    category?: VendorCategory;
    contactName?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    driveUrl?: string | null;
    deliverables?: string | null;
    notes?: string | null;
    contractedAmount?: number | null;
    paymentStatus?: PaymentStatus;
    dueDate?: Date | null;
  }
) {
  return prisma.vendor.update({
    where: { id },
    data,
    include: {
      expenses: true,
      tasks: true,
    },
  });
}

export async function deleteVendor(id: string) {
  return prisma.vendor.delete({
    where: { id },
  });
}

export async function getExpenses() {
  return prisma.expense.findMany({
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function createExpense(data: {
  title: string;
  category: ExpenseCategory;
  amount: number;
  status?: PaymentStatus;
  dueDate?: Date;
  paidDate?: Date;
  note?: string;
  vendorId?: string;
}) {
  return prisma.expense.create({
    data: {
      title: data.title,
      category: data.category,
      amount: data.amount,
      status: data.status,
      dueDate: data.dueDate,
      paidDate: data.paidDate,
      note: data.note,
      vendorId: data.vendorId,
    },
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
    },
  });
}

export async function updateExpense(
  id: string,
  data: {
    title?: string;
    category?: ExpenseCategory;
    amount?: number;
    status?: PaymentStatus;
    dueDate?: Date | null;
    paidDate?: Date | null;
    note?: string | null;
    vendorId?: string | null;
  }
) {
  return prisma.expense.update({
    where: { id },
    data,
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
    },
  });
}

export async function deleteExpense(id: string) {
  return prisma.expense.delete({
    where: { id },
  });
}

export async function getTasks() {
  return prisma.task.findMany({
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
      party: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function createTask(data: {
  title: string;
  details?: string;
  status?: TaskStatus;
  dueDate?: Date;
  owner?: TaskOwner;
  vendorId?: string;
  partyId?: string;
}) {
  return prisma.task.create({
    data: {
      title: data.title,
      details: data.details,
      status: data.status,
      dueDate: data.dueDate,
      owner: data.owner,
      vendorId: data.vendorId,
      partyId: data.partyId,
    },
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
      party: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    details?: string | null;
    status?: TaskStatus;
    dueDate?: Date | null;
    owner?: TaskOwner;
    vendorId?: string | null;
    partyId?: string | null;
  }
) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      vendor: {
        select: { id: true, name: true, category: true },
      },
      party: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}