import { prisma } from '@/lib/prisma';
import type { MealChoice } from '@/generated/prisma/client';

// ============ Utility Functions ============

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')          // replace spaces with hyphens
    .replace(/-+/g, '-');          // remove consecutive hyphens
}

// ============ Guest Queries ============

export async function getAllGuests() {
  return prisma.guest.findMany({
    include: { rsvp: true },
    orderBy: { name: 'asc' },
  });
}

export async function getGuestBySlug(slug: string) {
  return prisma.guest.findUnique({
    where: { slug },
    include: { rsvp: true },
  });
}

export async function getGuestByName(name: string) {
  return prisma.guest.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
    include: { rsvp: true },
  });
}

export async function getGuestById(id: string) {
  return prisma.guest.findUnique({
    where: { id },
    include: { rsvp: true },
  });
}

export async function createGuest(data: {
  name: string;
  email?: string;
  phone?: string;
  partySize?: number;
}) {
  const slug = generateSlug(data.name);
  return prisma.guest.create({ 
    data: {
      ...data,
      slug,
    }
  });
}

// ============ RSVP Queries ============

export async function getAllRSVPs() {
  return prisma.rSVP.findMany({
    include: { guest: true },
    orderBy: { respondedAt: 'desc' },
  });
}

export async function getRSVPByGuestId(guestId: string) {
  return prisma.rSVP.findUnique({
    where: { guestId },
    include: { guest: true },
  });
}

export async function createOrUpdateRSVP(
  guestId: string,
  data: {
    attending: boolean;
    mealChoices?: string[];
    dietaryNotes?: string;
    needsShuttle?: boolean;
    comments?: string;
  }
) {
  return prisma.rSVP.upsert({
    where: { guestId },
    create: { guestId, ...data },
    update: data,
  });
}

export async function updateRSVP(
  guestId: string,
  data: Partial<{
    attending: boolean;
    mealChoices: string[];
    dietaryNotes: string;
    needsShuttle: boolean;
    comments: string;
  }>
) {
  return prisma.rSVP.update({
    where: { guestId },
    data,
  });
}
