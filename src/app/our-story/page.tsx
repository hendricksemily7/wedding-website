import SharedHeader from "../sharedHeader";
import { calculateDaysToGo, weddingNavLinksList } from "../utils";
import Image from "next/image";

export default function Page() {
  return (
    <div className="font-sans min-h-screen bg-[#d5dad47f] flex flex-col"> { /* min height is screen height */}
      <SharedHeader
        coupleNames="EMILY & JESS"
        eventDetails="SEPTEMBER 26, 2026 • FAIRFAX, VT"
        countdown={calculateDaysToGo()}
        navLinksList={weddingNavLinksList}
      />
      { /*
          w-full: section is allowed to take up full available screen
          max-w-5xl: limited width so it never grows beyond ~80rem (1280px). This prevents it from stretching too wide on large monitors
          mx-auto: applies auto left/right margins, which centers it horiztonally when the width is constrained
          px-6: adds padding to the left and right so the content isn't jammed against the screen edge on small devices
        */
      }
      <main className="w-full max-w-5xl mx-auto px-6 py-8 flex-grow">
        { /*
            flex: turns the <div> container into a flex container. Its children become flex items, which can be arranged in rows or columns. 
            flex-col: Default layout: stack children vertically for small screens
            md:flex-row:  At the md breakpoint (>=768px), switch to row layout 
            items-center: controls cross-axis alignment (opposite of flex-direction)
            gap-8: Adds consistent spacing between flex children. 8 = 2rem = 32px. Replaces old school margin-right/bottom hacks.
          */
        }
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Image
            src="/holding.JPG"
            alt="Wedding photo"
            width={500}
            height={300}
            priority
            className="w-full md:w-1/2 h-auto rounded-lg"
          />
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <p>
              We met in the Summer of 2023 in the beautiful state of Vermont. Emily was in Rutland, and Jess was in Burlington.
            </p>
            <p>
              We knew we were a perfect match. Jess took a job in Colorado, and had a year of an unbelievable adventure, she wanted to be where her heart belongs, which is in Vermont with Emily and their families.
            </p>
            <p>
              In August 2024, we started the month off hot and got engaged at Rocky Mountain National Park, and by 8/24/24 we closed on a beautiful house together in the town of Fairfax, VT.
            </p>
            <p>
              We currently enjoy our daily life together waking up with our mini golden doodle Sophie, going on bike rides and hikes, the farmers market, breweries, concerts.. Cooking meals, enjoying the sunsets of Mount Mansfield. We couldn’t be happier.
            </p>
          </div>
        </div>
      </main>
        <footer className="flex gap-6 flex-wrap items-center justify-center py-10">
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
    
  );
}
