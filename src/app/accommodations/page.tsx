// src/app/accommodations/page.tsx
import './accommodations.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    // Outer container for the page content, applying the same centered, max-width behavior
    // as the "Our Story" page.
    <div className="w-full max-w-[1400px] mx-auto">
      
      {/* Container for all accommodations */}
      {/* Using flex-col with gap to create a vertical stack with consistent spacing */}
      <div className="flex flex-col gap-16 items-center">
        
        {/*
          Row 1: Holiday Inn.
          This block is made clickable by wrapping it in a Next.js <Link> component.
          It includes hover effects and padding for better user experience.
          We use flex-col for stacking the image and text vertically.
        */}
        <Link 
          href="https://www.ihg.com/holidayinn/hotels/us/en/st-albans/btvsa/hoteldetail"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 group cursor-pointer p-4 rounded-lg transition-colors duration-200"
        >
          {/* Hotel Title */}
          <h1 className="text-1xl md:text-2xl group-hover:underline">Holiday Inn, Saint Albans</h1>
          
          {/* Image Wrapper */}
          <div className="rounded-lg overflow-hidden max-h-[400px] md:max-h-none w-full max-w-[700px]">
            <Image 
                alt="Holiday Inn, Saint Albans" 
                src="/holiday3.jpg"
                width={700} 
                height={700} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {/*
          Row 2: Hampton Inn.
          Similar to the Holiday Inn block, wrapped in a clickable <Link> for navigation.
        */}
        <Link 
          href="https://www.hilton.com/en/hotels/btvstx-hampton-inn-st-albans/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 group cursor-pointer p-4 rounded-lg transition-colors duration-200"
        >
          {/* Hotel Title */}
          <h1 className="text-1xl md:text-2xl group-hover:underline">Hampton Inn, Saint Albans</h1>
          
          {/* Image Wrapper */}
          <div className="rounded-lg overflow-hidden max-h-[400px] md:max-h-none w-full max-w-[700px]">
            <Image 
                alt="Hampton Inn, Saint Albans" 
                src="/hampton.jpg"
                width={700} 
                height={700} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </Link>
        
      </div>
    </div>
  );
}
