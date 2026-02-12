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

// ============ Party Queries ============

export async function getAllParties() {
  return prisma.party.findMany({
    include: { 
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getPartyBySlug(slug: string) {
  return prisma.party.findUnique({
    where: { slug },
    include: { 
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function getPartyById(id: string) {
  return prisma.party.findUnique({
    where: { id },
    include: { 
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function createParty(data: {
  name: string;
  guestNames: string[]; // Array of individual guest names
}) {
  const slug = generateSlug(data.name);
  return prisma.party.create({
    data: {
      name: data.name,
      slug,
      guests: {
        create: data.guestNames.map(name => ({ name })),
      },
    },
    include: {
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function updateParty(
  id: string,
  data: {
    name?: string;
  }
) {
  const updateData: { name?: string; slug?: string } = {};
  
  if (data.name) {
    updateData.name = data.name;
    updateData.slug = generateSlug(data.name);
  }

  return prisma.party.update({
    where: { id },
    data: updateData,
    include: {
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function deleteParty(id: string) {
  return prisma.party.delete({
    where: { id },
  });
}

// ============ Guest Queries ============

export async function addGuestToParty(partyId: string, name: string) {
  return prisma.guest.create({
    data: {
      partyId,
      name,
    },
    include: { rsvp: true },
  });
}

export async function updateGuest(id: string, name: string) {
  return prisma.guest.update({
    where: { id },
    data: { name },
    include: { rsvp: true },
  });
}

export async function deleteGuest(id: string) {
  return prisma.guest.delete({
    where: { id },
  });
}

// ============ RSVP Queries ============

export async function createOrUpdateGuestRSVP(
  guestId: string,
  data: {
    attending: boolean;
    mealChoice?: MealChoice;
    dietaryNotes?: string;
    needsShuttle?: boolean;
    comments?: string;
  }
) {
  return prisma.rSVP.upsert({
    where: { guestId },
    create: { 
      guestId, 
      attending: data.attending,
      mealChoice: data.mealChoice,
      dietaryNotes: data.dietaryNotes,
      needsShuttle: data.needsShuttle ?? false,
      comments: data.comments,
    },
    update: {
      attending: data.attending,
      mealChoice: data.mealChoice,
      dietaryNotes: data.dietaryNotes,
      needsShuttle: data.needsShuttle,
      comments: data.comments,
      respondedAt: new Date(),
    },
  });
}

// Batch update RSVPs for multiple guests in a party
export async function updatePartyRSVPs(
  rsvps: Array<{
    guestId: string;
    attending: boolean;
    mealChoice?: MealChoice;
    dietaryNotes?: string;
    needsShuttle?: boolean;
    comments?: string;
  }>
) {
  return Promise.all(
    rsvps.map(rsvp => createOrUpdateGuestRSVP(rsvp.guestId, rsvp))
  );
}
