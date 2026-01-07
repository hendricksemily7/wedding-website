"use client";

import Image from "next/image";
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
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/rsvp/${slug}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Optional: RSVP illustration or photo */}
        <div className="w-full md:w-1/2 rounded-lg overflow-hidden flex justify-center items-center bg-[#95a6a0]">
          <Image
            src="/bwhands.jpg"
            alt="RSVP illustration"
            width={400}
            height={400}
            className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px]"
            priority
          />
        </div>
        {/* RSVP Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-lg">
            <h1
              className={`${playfair.className} text-2xl md:text-3xl tracking-[0.2em] mb-8 text-[#3b3b3b]`}
            >
              Enter the name on your invitation
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-6"
            >
              <input
                type="text"
                placeholder="e.g. John and Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#2D4D3A] rounded-md px-4 py-3 text-lg text-gray-700 focus:outline-none focus:ring-0 focus:ring-[#00674F] placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full border border-[#2D4D3A] text-[#2D4D3A] bg-transparent py-3 rounded-md font-medium tracking-wide hover:bg-[#95a6a0] transition"
              >
                Find RSVP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}