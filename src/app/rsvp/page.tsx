"use client";

import { Playfair_Display } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

export default function Page() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Convert name into URL-friendly slug (e.g., "John and Jane Doe" → "john-and-jane-doe")
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/rsvp/${slug}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center min-h-screen">
      {/* Title */}
      <h1
        className={`${playfair.className} text-2xl md:text-3xl tracking-[0.2em] mb-8 text-[#3b3b3b]`}
      >
        Enter the name on your invitation
      </h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-6"
      >
        <input
          type="text"
          placeholder="e.g. John and Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-lg border border-[#00674F] rounded-md px-4 py-3 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00674F] placeholder:text-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full max-w-lg border border-[#00674F] text-[#00674F] bg-transparent py-3 rounded-md font-medium tracking-wide hover:bg-[#00674F] hover:text-white transition"
        >
          Find RSVP
        </button>
      </form>
    </div>
  );
}
