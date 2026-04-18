import { prisma } from '@/lib/prisma';
import type { MealChoice } from '@/generated/prisma/client';
import Fuse from 'fuse.js';

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

export type PartySearchResult = {
  party: Awaited<ReturnType<typeof getAllParties>>[number];
  score: number;
  matchedOn: 'party' | 'guest';
  matchedName: string;
};

export async function fuzzySearchParties(searchTerm: string, limit = 5): Promise<PartySearchResult[]> {
  const parties = await getAllParties();
  
  // Create search items that include both party names and individual guest names
  type SearchItem = {
    party: typeof parties[number];
    searchName: string;
    type: 'party' | 'guest';
  };
  
  const searchItems: SearchItem[] = [];
  
  for (const party of parties) {
    // Add party name as searchable
    searchItems.push({
      party,
      searchName: party.name,
      type: 'party',
    });
    
    // Add each guest name as searchable (links back to their party)
    for (const guest of party.guests) {
      searchItems.push({
        party,
        searchName: guest.name,
        type: 'guest',
      });
    }
  }
  
  const fuse = new Fuse(searchItems, {
    keys: ['searchName'],
    threshold: 0.4, // 0 = perfect match, 1 = match anything. 0.4 is fairly loose
    includeScore: true,
    ignoreLocation: true, // Match anywhere in the string
    minMatchCharLength: 2,
  });
  
  const results = fuse.search(searchTerm);
  
  // Deduplicate by party ID (keep the best match for each party)
  const seenPartyIds = new Set<string>();
  const uniqueResults: PartySearchResult[] = [];
  
  for (const result of results) {
    if (!seenPartyIds.has(result.item.party.id)) {
      seenPartyIds.add(result.item.party.id);
      uniqueResults.push({
        party: result.item.party,
        score: result.score ?? 1,
        matchedOn: result.item.type,
        matchedName: result.item.searchName,
      });
    }
    if (uniqueResults.length >= limit) break;
  }
  
  return uniqueResults;
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
  weddingPartyFlags?: boolean[]; // Optional array matching guestNames order
}) {
  const slug = generateSlug(data.name);
  return prisma.party.create({
    data: {
      name: data.name,
      slug,
      guests: {
        create: data.guestNames.map((name, index) => ({
          name,
          isWeddingParty: data.weddingPartyFlags?.[index] ?? false,
        })),
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

export async function updateGuestDetails(id: string, data: { name?: string; isWeddingParty?: boolean }) {
  return prisma.guest.update({
    where: { id },
    data,
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
    attendingRehearsalDinner?: boolean;
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
      attendingRehearsalDinner: data.attendingRehearsalDinner,
      comments: data.comments,
    },
    update: {
      attending: data.attending,
      mealChoice: data.mealChoice,
      dietaryNotes: data.dietaryNotes,
      needsShuttle: data.needsShuttle,
      attendingRehearsalDinner: data.attendingRehearsalDinner,
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
    attendingRehearsalDinner?: boolean;
    comments?: string;
  }>
) {
  return Promise.all(
    rsvps.map(rsvp => createOrUpdateGuestRSVP(rsvp.guestId, rsvp))
  );
}
