// src/app/page.tsx
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const schedule = [
  { time: "3:30 PM", event: "Guest Arrival" },
  { time: "4:00 PM", event: "Ceremony" },
  { time: "4:30 PM", event: "Cocktail Hour" },
  { time: "5:30 PM", event: "First Dance" },
  { time: "6:00 PM", event: "Dinner" },
  { time: "7:00 PM", event: "Toasts" },
  { time: "7:15 PM", event: "Dancing & Dessert" },
  { time: "10:00 PM", event: "Send-Off" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/home3.jpg"
        alt="Wedding photo"
        width={1920}
        height={1080}
        priority
        className="w-2/3 h-auto rounded-lg"
      />

      {/* Schedule Section */}
      <div className="w-full max-w-2xl mx-auto px-6 mt-16 mb-12">
        <h2
          className={`${playfair.className} text-2xl md:text-3xl text-center mb-10`}
        >
          Schedule of Events
        </h2>

        <div className="flex flex-col items-center">
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 md:w-28 text-right text-sm md:text-base text-gray-600 font-medium">
                  {item.time}
                </span>
                <span className="mx-6 text-gray-600 tracking-[0.4em]">· · · · · · · · ·</span>
                <span className="w-36 md:w-44 text-left text-base md:text-lg">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
