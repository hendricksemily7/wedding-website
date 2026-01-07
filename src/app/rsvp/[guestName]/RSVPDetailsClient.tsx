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
    <div className="flex items-center justify-center w-full px-2 py-8 overflow-x-hidden">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl flex flex-col items-center box-border p-6 md:p-10">
        <h1
          className={`${playfair.className} text-3xl md:text-5xl font-medium text-[#2D4D3A] mb-10`}
        >
          {displayName}
        </h1>
        <div className="text-lg flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
          <button
            onClick={handleWillAttend}
            className="w-49 bg-transparent border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide hover:bg-[#95a6a0] transition"
          >
            Will Attend
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