"use client";

import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

interface RSVPDetailsClientProps {
  guestName: string;
}

export default function RSVPDetailsClient({ guestName }: RSVPDetailsClientProps) {
  const router = useRouter();

  const displayName = guestName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleWillAttend = () => {
    router.push(`/rsvp/${guestName}/meal`);
  };

  const handleWillNotAttend = () => {
    router.push(`/rsvp/${guestName}/decline`);
  };

  return (
    <div className="w-full min-h-screen bg-[#E9F0EC] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="bg-white shadow-md rounded-lg p-10 max-w-3xl w-full">
        <h1
          className={`${playfair.className} text-4xl md:text-5xl font-medium text-[#2D4D3A] mb-10`}
        >
          {displayName}
        </h1>

        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={handleWillAttend}
            className="bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#E9F0EC] transition"
          >
            Will Attend
          </button>
          <button
            onClick={handleWillNotAttend}
            className="bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#E9F0EC] transition"
          >
            Will Not Attend
          </button>
        </div>

        <div className="text-sm text-[#3b3b3b] space-y-1">
          <p>Hosted by Emily and Jess Hendricks</p>
          <p>Saturday, September 26 — 4:00 PM EDT</p>
          <p>The Inn at Grace Farm, Fairfax, VT</p>
        </div>
      </div>
    </div>
  );
}
