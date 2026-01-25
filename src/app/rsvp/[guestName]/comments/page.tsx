"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});


export default function CommentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guestName } = useParams();
  const meals = searchParams.get("meals");
  const [comments, setComments] = useState("");

const handleNext = () => {
    // Pass meals and comments to the shuttle page for final submission
    const params = new URLSearchParams();
    if (meals) params.set("meals", meals);
    if (comments) params.set("comments", comments);
    router.push(`/rsvp/${guestName}/shuttle?${params.toString()}`);
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg p-10 w-full max-w-2xl flex flex-col items-center">

      <h1 className={`${playfair.className} text-3xl font-semibold mb-4`}>Dietary Restrictions or Notes</h1>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Let us know about any allergies or preferences..."
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-[#2D4D3A] focus:ring-1 focus:ring-[#2D4D3A]"
      />
        <button
          onClick={handleNext}
          className={`mt-6 w-full border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide transition bg-transparent hover:bg-[#95a6a0] cursor-pointer`}
        >
          Continue
        </button>
    {/* </div> */}
    </div>
  );
}
