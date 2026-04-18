// src/app/page.tsx
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

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
        <div className={`${playfair.className} text-3xl md:text-5xl`}>Our Story</div>          

        <div className={`${playfair.className} text-xl md:w-1/2 text-center space-y-4`}>
          <p>
            We met in the Summer of 2023 in the beautiful state of Vermont. Emily was in Rutland, and Jess was in Burlington.
          </p>
          <p>
            We knew we were a perfect match. Jess took a job in Colorado, and after a year of an unbelievable adventure, she wanted to be where her heart belongs, which is in Vermont with Emily and their families.
          </p>
          <p>
            In August 2024, we started off the month by getting engaged at Rocky Mountain National Park, and by 8/24/24 we closed on a beautiful house together in Fairfax, VT.
          </p>
          <p>
            We currently enjoy our daily life together waking up with our mini golden doodle Sophie, our golden retriever Theo, going on bike rides and hikes, the farmers market, breweries, concerts, cooking meals, and enjoying the views of Mount Mansfield. We couldn’t be happier.
          </p>
        </div>
      </div>

    </div>
  );
}
