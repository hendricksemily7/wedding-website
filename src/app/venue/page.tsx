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
      <h1 className={`${playfair.className} text-2xl md:text-3xl font-bold mb-6`}>The Inn at Grace Farm</h1>

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
      <p className="text-xl text-gray-700 mb-2">
        Nestled in the heart of Vermont, our venue blends rustic charm with modern elegance.
      </p>
      <p className="text-xl text-gray-700">
        We can’t wait to celebrate this special day with you surrounded by nature and love.
      </p>
      <div className="flex justify-center items-center gap-2 mt-6 text-gray-700">
        <FaMapPin className="text-black-600 text-lg" />
        <span className="text-gray-700">117 Highbridge Rd, Fairfax, VT 05454</span>
      </div>

      {/* Map */}
      <div className="mt-8 w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2828.5!2d-72.9397!3d44.6647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cb58a8b8b8b8b8b%3A0x0!2s117%20Highbridge%20Rd%2C%20Fairfax%2C%20VT%2005454!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}