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

interface Guest {
  id: string;
  name: string;
  email?: string;
  partySize: number;
  rsvp?: {
    attending: boolean;
    mealChoices?: string[];
    dietaryNotes?: string;
    needsShuttle: boolean;
    comments?: string;
  };
}

interface RSVPDetailsClientProps {
  guestName: string;
}

export default function RSVPDetailsClient({ guestName }: RSVPDetailsClientProps) {
  const router = useRouter();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = guestName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    async function fetchGuest() {
      try {
        console.log("Fetching guest data for:", guestName);
        console.log("Encoded guest name:", encodeURIComponent(guestName));
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
        setGuest(data.guest);
      } catch (err) {
        setError("Failed to load reservation");
      } finally {
        setLoading(false);
      }
    }

    fetchGuest();
  }, [guestName]);

  const handleWillAttend = () => {
    router.push(`/rsvp/${guestName}/meal`);
  };

  const handleWillNotAttend = () => {
    router.push(`/rsvp/${guestName}/decline`);
  };

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
          {guest?.name || displayName}
        </h1>
        {guest?.rsvp && (
          <div className="mb-6 p-6 bg-[#f5f7f6] rounded-lg w-full max-w-md">
            <h2 className="text-[#2D4D3A] font-medium text-center mb-4">Your Response</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium text-[#2D4D3A]">Status</span>
                <span className="text-gray-700">{guest.rsvp.attending ? "Attending" : "Not Attending"}</span>
              </div>
              {guest.rsvp.mealChoices && guest.rsvp.mealChoices.length > 0 && (
                <div className="border-b border-gray-200 pb-2">
                  <span className="font-medium text-[#2D4D3A]">
                    {guest.rsvp.mealChoices.length > 1 ? "Meals" : "Meal"}
                  </span>
                  <div className="text-gray-700 mt-1">
                    {guest.rsvp.mealChoices.map((mealId, index) => (
                      <div key={index} className="text-right">
                        {guest.partySize > 1 && `Guest ${index + 1}: `}
                        {getFriendlyMealName(mealId)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {guest.rsvp.dietaryNotes && (
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium text-[#2D4D3A]">Notes</span>
                  <span className="text-gray-700 text-right max-w-[200px]">{guest.rsvp.dietaryNotes}</span>
                </div>
              )}
              {guest.rsvp.needsShuttle !== undefined && (
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium text-[#2D4D3A]">Shuttle</span>
                  <span className="text-gray-700">{guest.rsvp.needsShuttle ? "Yes" : "No"}</span>
                </div>
              )}
              {guest.rsvp.comments && (
                <div className="flex justify-between pb-2">
                  <span className="font-medium text-[#2D4D3A]">Comments</span>
                  <span className="text-gray-700 text-right max-w-[200px]">{guest.rsvp.comments}</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="text-lg flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
          <button
            onClick={handleWillAttend}
            className="w-49 bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#95a6a0] transition"
          >
            {guest?.rsvp ? "Update Response" : "Will Attend"}
          </button>
          <button
            onClick={handleWillNotAttend}
            className="w-49 bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#95a6a0] transition"
          >
            Will Not Attend
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