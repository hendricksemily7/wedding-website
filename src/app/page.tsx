// src/app/page.tsx
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const schedule = [
  { time: "4:00 PM", event: "Guest Arrival" },
  { time: "4:30 PM", event: "Ceremony" },
  { time: "5:00 PM", event: "Cocktail Hour" },
  { time: "6:00 PM", event: "First Dance" },
  { time: "6:15 PM", event: "Dinner" },
  { time: "7:00 PM", event: "Toasts" },
  { time: "7:15 PM", event: "Dancing & Dessert" },
  { time: "10:00 PM", event: "Send-Off" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <Image
        src="/home3.jpg"
        alt="Wedding photo"
        width={1920}
        height={1080}
        priority
        className="w-full max-w-[720px] h-auto rounded-lg"
      />

      {/* Schedule Section */}
      <div className={`${playfair.className} w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 mt-10 md:mt-16 mb-10 md:mb-12`}>
        <h2
          className="text-2xl md:text-3xl text-center mb-8 md:mb-10"
        >
          Schedule of Events
        </h2>

        <div className="flex flex-col items-center">
          <div className="space-y-5 w-full">
            {schedule.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-0 text-center md:text-left">
                <span className="md:w-28 md:text-right text-sm md:text-base text-gray-700 font-medium">
                  {item.time}
                </span>
                <span className="hidden md:inline mx-6 text-gray-600 tracking-[0.4em]">· · · · · · · · ·</span>
                <span className="text-base md:text-lg md:w-44 md:text-left">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
