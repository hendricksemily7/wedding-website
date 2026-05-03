'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navLinksDict } from './utils';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  weight: '500',
  subsets: ['latin'],
});

interface HeaderProps {
  coupleNames: string;
  eventDetails: string;
  countdown: string;
  navLinksList: { label: string; href: string, target: string }[];
}

const SharedHeader: React.FC<HeaderProps> = ({
  coupleNames,
  eventDetails,
  countdown,
  navLinksList,
}) => {
  const pathname = usePathname() as string;
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const menuLabel = navLinksDict[pathname] || "";

  return (
    <header className="w-full overflow-x-hidden">
      {/* Top info section */}
      <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col items-center px-4 pb-4">
        <h1 className={`${playfair.className} text-3xl md:text-4xl text-center`}>
          {coupleNames}
        </h1>
        <p
          className={`${playfair.className} text-sm md:text-base text-center tracking-wide`}
        >
          {eventDetails}
        </p>
        <p
          className={`${playfair.className} text-sm md:text-base text-center tracking-wide`}
        >
          {countdown}
        </p>
      </div>

      {/* Navigation */}
      <nav className="w-full overflow-x-hidden bg-[#95a6a0]">
        {/* Mobile toggle button */}
        <div className={`${playfair.className} mx-auto flex w-full max-w-5xl min-w-0 items-center justify-between px-4 pt-4 pb-2 text-base md:hidden`}>
          <span className="text-md min-w-0 truncate pr-2 font-semibold">
            {!isOpen ? menuLabel.toUpperCase() : ''}
          </span>
          <button onClick={() => setIsOpen(!isOpen)} className="shrink-0 focus:outline-none" aria-label="Toggle menu">
            {/* Simple hamburger */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </div>
          </button>
        </div>

        {/* Links */}
        <ul
          className={`${playfair.className}
            mx-auto w-full max-w-5xl overflow-x-hidden text-lg
            md:flex md:flex-row md:items-center md:justify-center md:gap-4 md:px-6 md:pt-6
            ${isOpen ? 'flex flex-col items-center gap-2 px-4 pb-4' : 'hidden'}
          `}
        >
          {navLinksList.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.target}
                  className={`
                    font-semibold px-3 py-2 rounded transition-colors
                    ${isActive ? 'text-[#5F8575]' : 'text-gray-800'}
                    hover:text-[#5F8575]
                  `}
                  onClick={() => setIsOpen(false)}

                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default SharedHeader;
