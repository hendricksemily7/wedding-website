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
  // <div className="flex items-center justify-center w-full px-6 py-12 bg-[#E9F0EC]">
    <div className="flex items-center justify-center w-full px-6 py-12">
    <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-2xl flex flex-col items-center">
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

        <div className="text-sm text-[#2D4D3A] space-y-1 text-center">
          <p>Hosted by Emily and Jess Hendricks</p>
          <p>Saturday, September 26 — 4:30 PM EDT</p>
          <p>The Inn at Grace Farm, Fairfax, VT</p>
        </div>
      </div>
    </div>
  );
}