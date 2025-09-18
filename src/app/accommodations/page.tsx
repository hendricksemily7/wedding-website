import SharedHeader from '../sharedHeader';
import { calculateDaysToGo, weddingNavLinks } from '../utils';
import './accommodations.css'
import Image from 'next/image';

// I want to make it so thase go down in a row - are clickable and more
export default function Page() {
  return (
    <div className="font-sans min-h-screen"> {/* Removed grid, padding, and centering from this div */}
      <SharedHeader
        logoSrc="/bwface.jpg"
        coupleNames="EMILY & JESS"
        eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
        countdown={calculateDaysToGo()}
        navLinks={weddingNavLinks}
      />
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 bg-[#d5dad47f]">
        {/* 
          The main container now holds two separate flex items, one for each hotel.
          To maintain vertical layout for these rows, use flex-col on the main element.
        */}
        <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start">
          {/* Row 1: Holiday Inn */}
          <div className="flex flex-col items-center gap-4">
            <h1>Holiday Inn, Saint Albans</h1>
            <Image 
                alt="Holiday Inn, Saint Albans" 
                src="/holiday.jpg"
                className="hotel-image"
                width={700} 
                height={700} 
            />
          </div>
          
          {/* Row 2: Hampton Inn */}
          <div className="flex flex-col items-center gap-4">
            <h1>Hampton Inn, Saint Albans</h1>
            <Image 
                alt="Hampton Inn, Saint Albans" 
                src="/hampton.jpg"
                className="hotel-image"
                width={700} 
                height={700} 
            />
          </div>
        </main>
        <footer className="row-start-2 flex gap-[24px] flex-wrap items-center justify-center"> {/* Adjusted row-start */}
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Built with nextjs
          </a>
        </footer>
      </div>
    </div>
  );
}
