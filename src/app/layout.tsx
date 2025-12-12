// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SharedHeader from "./sharedHeader";
import { calculateDaysToGo, weddingNavLinksList } from "./utils";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Emily & Jess Wedding",
  description: "Wedding Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        body:
        - font-sans: use sans-serif font globally
        - min-h-screen: ensures body always fills at least the screen height
        - min-w-screen: ensures it spans the full width
        - bg-[#d5dad47f]: soft custom background color
      */}
      <body className="font-sans min-h-screen min-w-screen">
      <div className="">
        {/* < Image src="/drawing-removebg-preview.png" alt="Wedding photo" width={500} height={300} className="md:max-w-[600px] w-full md:rounded-lg h-auto mx-auto" /> */}
      {/* < Image src="/Shadow-removebg-preview.png" alt="Wedding photo" width={900} height={700} className="md:max-w-[900px] w-full md:rounded-lg h-auto mx-auto" /> */}
      {/* < Image src="/TRY-removebg-preview.png" alt="Wedding photo" width={900} height={700} className="md:max-w-[900px] w-full md:rounded-lg h-auto mx-auto" /> */}
       < Image src="/Notes_251129_133244-removebg-preview.png" alt="Wedding photo" width={900} height={700} className="md:max-w-[900px] w-full md:rounded-lg h-auto mx-auto" />
       {/* < Image src="/Untitled_design-removebg-preview.png" alt="Wedding photo" width={900} height={700} className="md:max-w-[900px] w-full md:rounded-lg h-auto mx-auto" /> */}
      </div>
        {/*
          Header wrapper:
          - bg-[#d5dad47f]: gives the header a consistent light gray background
          - w-full: ensures the header spans the entire width of the screen
        */}
        <div className="w-full">
          <SharedHeader
            coupleNames="EMILY & JESS"
            eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
            countdown={calculateDaysToGo()}
            navLinksList={weddingNavLinksList}
          />
        </div>

        {/*
          Main + Footer wrapper:
          - grid: lays out page content with CSS Grid
          - min-h-screen: ensures this container stretches full screen height
          - grid-rows-[1fr_auto]: defines 2 rows → main content takes remaining space, footer takes only what it needs
          - bg-[#d5dad47f]: same background as body, keeps consistency
          - p-10: global padding inside this wrapper
          - pb-4: slightly smaller bottom padding so footer isn't flush against edge
          - gap-16: spacing between main content and footer
        */}
          <div className="grid min-h-screen grid-rows-[1fr_auto] p-10 pb-4 bg-[#E9F0EC]">
          
          {/*
            main:
            - row-start-1: explicitly places main content into the first grid row (the "1fr" row)
            - flex flex-col: stacks children vertically
            - items-center: center-aligns children horizontally on mobile
            - sm:items-start: switch to left-alignment on larger screens
          */}
          <main className="row-start-1 flex flex-col items-center sm:items-start">
            
            {/*
              max-width content wrapper:
              - w-full: allows full width within parent
              - max-w-5xl: caps the width (~1280px) to prevent super-wide stretching
              - mx-auto: centers this wrapper horizontally when max width kicks in
              - flex flex-col gap-[32px]: vertical stacking with 32px spacing between children
            */}
            <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-[32px] bg-[#E9F0EC]">
              {children}
            </div>
          </main>

          {/*
            footer:
            - row-start-2: places it in the second grid row (the "auto" row)
            - flex gap-[24px]: horizontal flex layout with 24px spacing
            - flex-wrap: allow items to wrap onto multiple lines on small screens
            - items-center: vertically center footer content
            - justify-center: center horizontally
          */}
          <footer className="row-start-2 flex gap-[24px] flex-wrap items-center justify-center pt-10">
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
              Built with Next.js
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
