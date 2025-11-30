// src/app/page.tsx
import Image from "next/image";
import { Playfair_Display } from 'next/font/google';
import { FaMapPin } from 'react-icons/fa'; // Example from Font Awesome

const playfair = Playfair_Display({
  weight: '400',
  subsets: ['latin'],
});

export default function Page() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 text-center">
      {/* Title */}
      <h1 className={`${playfair.className} text-2xl md:text-2xl font-bold mb-6`}>The Inn at Grace Farm</h1>

      {/* Image */}
      <div className="relative w-full h-80 md:h-[500px] mb-6">
        <Image
          src="/InnAtGrace1.jpg"
          alt="Wedding Venue"
          fill
          className="object-cover rounded-2xl shadow-lg"
          priority
        />
      </div>

      {/* Text lines */}
      <p className="text-lg text-gray-700 mb-2">
        Nestled in the heart of Vermont, our venue blends rustic charm with modern elegance.
      </p>
      <p className="text-lg text-gray-700">
        We can’t wait to celebrate this special day with you surrounded by nature and love.
      </p>
      <div className="flex justify-center items-center gap-2 mt-6 text-gray-700">
        <FaMapPin className="text-black-600 text-lg" />
        <span className="text-gray-700">117 Highbridge Rd, Fairfax, VT 05454</span>
      </div>
    </div>
  );
}