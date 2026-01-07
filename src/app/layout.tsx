// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SharedHeader from "./sharedHeader";
import { weddingNavLinksList } from "./utils";
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
      <body className="font-sans min-h-screen min-w-screen">
        <div className="bg-[#E9F0EC] w-full flex justify-center">
          <Image
            // src="/mansfield-drawing.png"
            src="/drawing-removebg-preview.png"
            alt="Wedding photo"
            width={400}
            height={240}
            className="max-w-xs md:max-w-md w-full md:rounded-lg h-auto mx-auto"
          />
        </div>
        <div className="bg-[#E9F0EC] w-full">
          <SharedHeader
            coupleNames="EMILY & JESS"
            // eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
            // countdown={calculateDaysToGo()}
            navLinksList={weddingNavLinksList}
          />
        </div>
        <div className="grid min-h-screen grid-rows-[1fr_auto] p-10 pb-4 bg-[#E9F0EC]">
          <main className="row-start-1 flex flex-col items-center sm:items-start">
            <div className="flex justify-center w-full">
              {children}
            </div>
          </main>
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
