"use client";

import { Playfair_Display } from "next/font/google";
import { useState } from "react";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

export default function ShuttlePage() {
  const [shuttleInterest, setShuttleInterest] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-2 py-8">
      <div className="bg-white shadow-md rounded-lg p-5 md:p-10 w-full flex flex-col items-start">
        <h1 className={`${playfair.className} text-3xl md:text-3xl font-semibold mb-4 text-[#2D4D3A] text-left`}>
          Shuttle Service RSVP
        </h1>
        <p className="mb-4 text-xl md:text-lg text-gray-700 text-left">
          If you are staying at the Hampton Inn or Holiday Inn, you have the option to take a shuttle bus to get to and from the venue.<br />
          Please use this form to let us know if you plan on taking the shuttle.<br />
          Please note, ride share services are very limited in this area of VT. You can arrange for taxi services with Green Mountain Transportation if you need a ride and opt out of the shuttle.
        </p>
        <h2 className="text-lg md:text-base font-semibold text-[#2D4D3A] mb-2 pt-5 text-left">SHUTTLE SCHEDULE</h2>
        <div className="w-full flex flex-col md:flex-row gap-6 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-[#2D4D3A] text-base md:text-base text-left">Hotel Departure Options</h3>
            <div className="flex gap-4 text-base md:text-base">
                3:30 PM and 3:45 PM
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-[#2D4D3A] text-base md:text-base text-left">Venue Departure Options</h3>
            <div className="flex gap-4 text-base md:text-base">
                9:00 PM and 10:00 PM
            </div>
          </div>
        </div>
        <p className="mb-4 pt-10 text-xl md:text-lg text-gray-600 text-left">
          This is a loose RSVP—no worries if it changes, we’re just looking for a rough headcount.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
          <div className="flex gap-6 text-base md:text-base">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shuttle"
                value="yes"
                checked={shuttleInterest === "yes"}
                onChange={() => setShuttleInterest("yes")}
                className="accent-[#2D4D3A]"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shuttle"
                value="no"
                checked={shuttleInterest === "no"}
                onChange={() => setShuttleInterest("no")}
                className="accent-[#2D4D3A]"
              />
              No
            </label>
          </div>
          <button
            type="submit"
            disabled={!shuttleInterest}
            className={`text-center items-center border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide transition
              ${shuttleInterest && (shuttleInterest === "no" || shuttleInterest === "yes")
                ? "bg-transparent hover:bg-[#E9F0EC] cursor-pointer"
                : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"}
            `}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}