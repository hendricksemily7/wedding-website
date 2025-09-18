import SharedHeader from "../sharedHeader";
import { calculateDaysToGo, weddingNavLinks } from "../utils";
import Image from "next/image";
import './ourStory.css';

export default function Page() {
  return (
    <div className="font-sans min-h-screen"> {/* Removed grid, padding, and centering from this div */}
      {/* Header component incorporated here - now outside the main content grid for full width */}
      <SharedHeader
        logoSrc="/bwface.jpg"
        coupleNames="EMILY & JESS"
        eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
        countdown={calculateDaysToGo()}
        navLinks={weddingNavLinks}
      />

      {/* Main content wrapper - retains the grid and padding for its internal elements */}
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 bg-[#d5dad47f]"> {/* Adjusted grid-rows for main content */}
        <main className="story-container"> {/* Adjusted row-start */}
          <div className="flex flex-row gap-4">
            <Image
              src="/holding.JPG"
              alt="Wedding photo"
              width={400}
              height={150}
              priority
              className="story-image"
            />
          <div className="our-story-body">
            <p>We met in the Summer of 2023 in the beautiful state of Vermont. Emily was in Rutland, and Jess was in Burlington. </p>
            <br></br>
            <p>We knew we were a perfect match. Jess took a job in Colorado, and had a year of an ubelievable adventure, she wanted to be where her heart belongs, which is in Vermont with Emily and their families.</p>
            <br></br>
            <p>In August 2024, we started the month off hot and got engaged at Rocky Mountain National Park, and by 8/24/24 we closed on a beautiful house together in the town of Fairfax, VT. </p>
            <br></br>
            <p>We currently enjoy our daily life together waking up with our mini golden doodle Sophie, going on bike rides and hikes, the farmers market, breweries, concerts.. Cooking meals, enjoying the sunsets of Mount Mansifled. We couldnt be happier.</p>
          </div>
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
