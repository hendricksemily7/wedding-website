"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { meals } from "../meal/page";

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
  guests: Guest[];
}

interface GuestResponse {
  guestId: string;
  attending: boolean | null;
  mealChoice: string | null;
  dietaryNotes: string;
  needsShuttle: boolean;
}

export default function RespondPage() {
  const router = useRouter();
  const { guestName } = useParams();
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track responses for each guest
  const [responses, setResponses] = useState<GuestResponse[]>([]);
  
  // Current step in the flow
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [step, setStep] = useState<"attending" | "meal" | "dietary" | "shuttle" | "review">("attending");

  useEffect(() => {
    async function fetchParty() {
      try {
        const res = await fetch(`/api/rsvp/${encodeURIComponent(guestName as string)}`);
        if (!res.ok) {
          setError("Failed to load reservation");
          return;
        }
        
        const data = await res.json();
        setParty(data.party);
        
        // Initialize responses from existing RSVPs or empty
        const initialResponses: GuestResponse[] = data.party.guests.map((guest: Guest) => ({
          guestId: guest.id,
          attending: guest.rsvp?.attending ?? null,
          mealChoice: guest.rsvp?.mealChoice ?? null,
          dietaryNotes: guest.rsvp?.dietaryNotes ?? "",
          needsShuttle: guest.rsvp?.needsShuttle ?? false,
        }));
        setResponses(initialResponses);
      } catch (err) {
        setError("Failed to load reservation");
      } finally {
        setLoading(false);
      }
    }

    fetchParty();
  }, [guestName]);

  const currentGuest = party?.guests[currentGuestIndex];
  const currentResponse = responses[currentGuestIndex];

  const updateCurrentResponse = (updates: Partial<GuestResponse>) => {
    setResponses(prev => {
      const updated = [...prev];
      updated[currentGuestIndex] = { ...updated[currentGuestIndex], ...updates };
      return updated;
    });
  };

  const handleAttendingChoice = (attending: boolean) => {
    updateCurrentResponse({ attending });
    
    if (attending) {
      setStep("meal");
    } else {
      // Not attending - skip to next guest or review
      moveToNextGuestOrReview();
    }
  };

  const handleMealChoice = (mealChoice: string) => {
    updateCurrentResponse({ mealChoice });
    setStep("dietary");
  };

  const handleDietaryNext = () => {
    setStep("shuttle");
  };

  const handleShuttleChoice = (needsShuttle: boolean) => {
    updateCurrentResponse({ needsShuttle });
    moveToNextGuestOrReview();
  };

  const moveToNextGuestOrReview = () => {
    if (party && currentGuestIndex < party.guests.length - 1) {
      setCurrentGuestIndex(prev => prev + 1);
      setStep("attending");
    } else {
      setStep("review");
    }
  };

  const handleSubmit = async () => {
    if (!party) return;
    
    setSaving(true);
    try {
      // Format responses for the API
      const rsvps = responses.map(r => ({
        guestId: r.guestId,
        attending: r.attending ?? false,
        mealChoice: r.attending ? r.mealChoice : undefined,
        dietaryNotes: r.dietaryNotes || undefined,
        needsShuttle: r.attending ? r.needsShuttle : false,
      }));

      const res = await fetch(`/api/rsvp/${encodeURIComponent(guestName as string)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvps }),
      });

      if (!res.ok) {
        throw new Error("Failed to save RSVP");
      }

      router.push(`/rsvp/${guestName}?saved=true`);
    } catch (err) {
      alert("Failed to save your RSVP. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (step === "review") {
      // Go back to last guest's last step
      const lastGuestIndex = party ? party.guests.length - 1 : 0;
      setCurrentGuestIndex(lastGuestIndex);
      const lastResponse = responses[lastGuestIndex];
      if (lastResponse?.attending) {
        setStep("shuttle");
      } else {
        setStep("attending");
      }
    } else if (step === "shuttle") {
      setStep("dietary");
    } else if (step === "dietary") {
      setStep("meal");
    } else if (step === "meal") {
      setStep("attending");
    } else if (step === "attending" && currentGuestIndex > 0) {
      // Go back to previous guest
      setCurrentGuestIndex(prev => prev - 1);
      const prevResponse = responses[currentGuestIndex - 1];
      if (prevResponse?.attending) {
        setStep("shuttle");
      } else {
        setStep("attending");
      }
    }
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

  if (error || !party) {
    return (
      <div className="flex items-center justify-center w-full px-2 py-8">
        <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 md:p-10">
          <p className="text-center">{error || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  // Review step - show summary
  if (step === "review") {
    return (
      <div className="flex items-center justify-center w-full px-2 py-8">
        <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 md:p-10">
          <h1 className={`${playfair.className} text-3xl font-semibold text-[#2D4D3A] mb-6 text-center`}>
            Review Your RSVP
          </h1>
          
          <div className="space-y-4 mb-8">
            {party.guests.map((guest, index) => {
              const response = responses[index];
              const mealName = meals.find(m => m.id === response?.mealChoice)?.name;
              
              return (
                <div key={guest.id} className="bg-[#f5f7f6] rounded-lg p-4">
                  <div className="font-medium text-[#2D4D3A] mb-2">{guest.name}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attending</span>
                      <span className={response?.attending ? "text-green-700" : "text-red-700"}>
                        {response?.attending ? "Yes" : "No"}
                      </span>
                    </div>
                    {response?.attending && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meal</span>
                          <span className="text-gray-700">{mealName || "Not selected"}</span>
                        </div>
                        {response.dietaryNotes && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dietary Notes</span>
                            <span className="text-gray-700 text-right max-w-[150px]">{response.dietaryNotes}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shuttle</span>
                          <span className="text-gray-700">{response.needsShuttle ? "Yes" : "No"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={goBack}
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#2D4D3A] text-white px-8 py-3 rounded-md font-medium hover:bg-[#1f3528] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit RSVP"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Progress indicator
  const totalSteps = party.guests.length;
  const progressText = totalSteps > 1 
    ? `Guest ${currentGuestIndex + 1} of ${totalSteps}`
    : "";

  return (
    <div className="flex items-center justify-center w-full px-2 py-8">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-6 md:p-10">
        {/* Progress */}
        {progressText && (
          <div className="text-center text-sm text-gray-500 mb-2">{progressText}</div>
        )}
        
        {/* Guest name */}
        <h1 className={`${playfair.className} text-2xl md:text-3xl font-semibold text-[#2D4D3A] mb-6 text-center`}>
          {currentGuest?.name}
        </h1>
        
        {/* Attending step */}
        {step === "attending" && (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8">Will you be attending?</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleAttendingChoice(true)}
                className="border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium hover:bg-[#95a6a0] transition"
              >
                Yes, I&apos;ll be there
              </button>
              <button
                onClick={() => handleAttendingChoice(false)}
                className="border border-gray-300 text-gray-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Sorry, can&apos;t make it
              </button>
            </div>
            {currentGuestIndex > 0 && (
              <button
                onClick={goBack}
                className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back
              </button>
            )}
          </div>
        )}
        
        {/* Meal step */}
        {step === "meal" && (
          <div>
            <p className="text-lg text-gray-700 mb-2 text-center">Select your meal</p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              All meals come with broiled asparagus, dinner rolls, and salad.
            </p>
            <div className="space-y-3">
              {meals.map(meal => (
                <button
                  key={meal.id}
                  onClick={() => handleMealChoice(meal.id)}
                  className={`w-full text-left border p-4 rounded-xl transition
                    ${currentResponse?.mealChoice === meal.id
                      ? "border-[#2D4D3A] bg-[#95a6a0]"
                      : "border-gray-200 bg-white hover:border-[#2D4D3A]"}
                  `}
                >
                  <span className="font-medium text-[#2D4D3A]">{meal.name}</span>
                  <p className="text-sm text-gray-500">{meal.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={goBack}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm block mx-auto"
            >
              ← Back
            </button>
          </div>
        )}
        
        {/* Dietary notes step */}
        {step === "dietary" && (
          <div>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Any dietary restrictions or allergies?
            </p>
            <textarea
              value={currentResponse?.dietaryNotes || ""}
              onChange={(e) => updateCurrentResponse({ dietaryNotes: e.target.value })}
              placeholder="Let us know about any allergies or preferences... (optional)"
              className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:border-[#2D4D3A]"
            />
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={goBack}
                className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={handleDietaryNext}
                className="border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium hover:bg-[#95a6a0] transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Shuttle step */}
        {step === "shuttle" && (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">
              Will you need shuttle service?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Shuttle runs from Hampton Inn & Holiday Inn to the venue and back.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleShuttleChoice(true)}
                className="border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium hover:bg-[#95a6a0] transition"
              >
                Yes, please
              </button>
              <button
                onClick={() => handleShuttleChoice(false)}
                className="border border-gray-300 text-gray-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition"
              >
                No, thanks
              </button>
            </div>
            <button
              onClick={goBack}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
