// src/app/page.tsx
import Image from "next/image";
import SharedHeader from './sharedHeader'; // Adjust the import path if your Header.tsx is not in the same directory
import { calculateDaysToGo, weddingNavLinks } from "./utils";

export default function Home() {
  return (
    <div className="font-sans min-h-screen"> {/* Removed grid, padding, and centering from this div */}
      {/* Header component incorporated here - now outside the main content grid for full width */}
      <SharedHeader
        logoSrc="/bwface.jpg"
        // logoSrc="/mansfield2.png"
        coupleNames="EMILY & JESS"
        eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
        countdown={calculateDaysToGo()}
        navLinks={weddingNavLinks}
      />

      {/* Main content wrapper - retains the grid and padding for its internal elements */}
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 bg-[#d5dad47f]"> {/* Adjusted grid-rows for main content */}
        <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start"> {/* Adjusted row-start */}
          <div className="flex flex-row gap-4">
            <Image
              src="/bwkiss.jpg"
              alt="Wedding photo"
              width={500}
              height={200}
              priority
            />
            <Image
              src="/bwalk.jpg"
              alt="Wedding photo"
              width={500}
              height={200}
              priority
            />
            <Image
              src="/bwholding.jpg"
              alt="Wedding photo"
              width={500}
              height={200}
              priority
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
