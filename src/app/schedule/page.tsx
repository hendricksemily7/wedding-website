// src/app/page.tsx
import Image from "next/image";
import { Caveat } from "next/font/google";


const caveat = Caveat({
  weight: '700',
  subsets: ['latin'],
})

export default function Page() {
  return (
    // Outer container for the page content
    // We add max-w-[1400px] and mx-auto to center the content and not stretch it to the edge
    <div className="w-full max-w-5xl mx-auto">
      
      {/* Container for the image and text */}
      {/* This sets a flex layout: single column by default (mobile-first),
          then a row on medium screens and up.
          justify-between creates space between the two items. */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Image wrapper */}
        {/* On medium screens, this takes 50% width. On mobile, it's full width */}
        <div className="w-full md:w-1/2 rounded-lg overflow-hidden max-h-[400px] md:max-h-none">
          <Image
            src="/holding.JPG"
            alt="Wedding photo"
            width={500}
            height={300}
            priority
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        
        {/* Text content wrapper 
        TODO: use Borel google font for "Our story" text bigger*/}
        {/* On medium screens, this takes 50% width. On mobile, it's full width */}
        <div className={`${caveat.className} text-5xl md:text-6xl`}>Schedule</div>          

        <div className="text-xl md:w-1/2 text-center space-y-4">
          <p>text</p>
        </div>
      </div>

    </div>
  );
}
