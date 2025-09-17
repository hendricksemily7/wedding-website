import SharedHeader from "../sharedHeader";
import { weddingNavLinks } from "../utils";
import Image from "next/image";

export default function Page() {
  return (
    <div className="font-sans min-h-screen"> {/* Removed grid, padding, and centering from this div */}
      {/* Header component incorporated here - now outside the main content grid for full width */}
      <SharedHeader
        logoSrc="/holding.JPG"
        navLinks={weddingNavLinks}
      />

      {/* Main content wrapper - retains the grid and padding for its internal elements */}
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 bg-[#d5dad47f]"> {/* Adjusted grid-rows for main content */}
        <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start"> {/* Adjusted row-start */}
          <div className="our-story-body">
            <p>We originally met in the Summer of 2023 in the loveley state of Vemront. Emily in Rutland, Jess in Burlington. </p>
            <p>We knew we were each others right person and we were met for each other. Jess took a job in Colorado, and had a year of an ubelievable adventure, she wanted to be where her heart belongs, which is in Vermont with Emily and their families.</p>
            <p>In August 2024, we started the month off hot and got engaged at Rocky Mountain National Park, and by 8/24/24 we closed on a beautiful house together in the town of Fairfax, VT. </p>
            <p>We currently enjoy our daily life together waking up with our mini golden doodle Sophie, going on bike rides and hikes, the farmers market, breweries, concerts.. Cooking meals, enjoying the sunsets of Mount Mansifled. We couldnt be happier.</p>
            
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
