"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { meals } from "./meal/page";

function getFriendlyMealName(mealId: string) {
  const meal = meals.find((meal) => meal.id === mealId);
  return meal?.name ?? mealId;
}

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

interface RSVP {
  attending: boolean;
  mealChoice?: string;
  dietaryNotes?: string;
  needsShuttle: boolean;
  comments?: string;
}

interface Guest {
  id: string;
  name: string;
  rsvp?: RSVP;
}

interface Party {
  id: string;
  name: string;
  slug: string;
  email?: string;
  guests: Guest[];
}

interface RSVPDetailsClientProps {
  guestName: string;
}

export default function RSVPDetailsClient({ guestName }: RSVPDetailsClientProps) {
  const router = useRouter();
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = guestName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    async function fetchParty() {
      try {
        const res = await fetch(`/api/rsvp/${encodeURIComponent(guestName)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Sorry, the name you entered was not found. Please check your invitation and try again.");
          } else {
            setError("Failed to load reservation");
          }
          return;
        }
        
        const data = await res.json();
        setParty(data.party);
      } catch (err) {
        setError("Failed to load reservation");
      } finally {
        setLoading(false);
      }
    }

    fetchParty();
  }, [guestName]);

  const handleStartRSVP = () => {
    router.push(`/rsvp/${guestName}/respond`);
  };

  // Check if all guests have responded
  const allResponded = party?.guests.every(g => g.rsvp) ?? false;
  const attendingGuests = party?.guests.filter(g => g.rsvp?.attending) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full px-2 py-8">
        <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 md:p-10">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full px-2 py-8">
        <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 md:p-10">
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full px-2 py-8 overflow-x-hidden">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl flex flex-col items-center box-border p-6 md:p-10">
        <h1
          className={`${playfair.className} text-3xl md:text-5xl font-medium text-[#2D4D3A] mb-10`}
        >
          {party?.name || displayName}
        </h1>
        
        {/* Show current responses if any exist */}
        {party && party.guests.some(g => g.rsvp) && (
          <div className="mb-6 p-6 bg-[#f5f7f6] rounded-lg w-full max-w-md">
            <h2 className="text-[#2D4D3A] font-medium text-center mb-4">Your Responses</h2>
            <div className="space-y-4">
              {party.guests.map((guest) => (
                <div key={guest.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                  <div className="font-medium text-[#2D4D3A] mb-2">{guest.name}</div>
                  {guest.rsvp ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={guest.rsvp.attending ? "text-green-700" : "text-red-700"}>
                          {guest.rsvp.attending ? "Attending" : "Not Attending"}
                        </span>
                      </div>
                      {guest.rsvp.attending && guest.rsvp.mealChoice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meal</span>
                          <span className="text-gray-700">{getFriendlyMealName(guest.rsvp.mealChoice)}</span>
                        </div>
                      )}
                      {guest.rsvp.attending && guest.rsvp.needsShuttle && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shuttle</span>
                          <span className="text-gray-700">Yes</span>
                        </div>
                      )}
                      {guest.rsvp.dietaryNotes && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Notes</span>
                          <span className="text-gray-700 text-right max-w-[150px]">{guest.rsvp.dietaryNotes}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No response yet</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-lg flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
          <button
            onClick={handleStartRSVP}
            className="w-49 bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#95a6a0] transition"
          >
            {allResponded ? "Update Response" : "RSVP Now"}
          </button>
        </div>
        <div className="text-lg text-[#2D4D3A] space-y-3 text-center">
          <p>Hosted by Emily and Jess Hendricks</p>
          <p>Saturday, September 26 — 4:30 PM EDT</p>
          <p>The Inn at Grace Farm, Fairfax, VT</p>
        </div>
      </div>
    </div>
  );
}