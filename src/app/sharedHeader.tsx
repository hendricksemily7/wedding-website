'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navLinksDict } from './utils';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  weight: '400',
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
    <header className="">
      {/* Top info section */}
      <div className="flex flex-col items-center pb-10">
        <h1 className={`${playfair.className} text-2xl md:text-4xl text-center`}>
          {coupleNames}
        </h1>
        <p
          className={`${playfair.className} text-sm md:text-base text-stone-500 text-center`}
        >
          {eventDetails}
        </p>
        <p
          className={`${playfair.className} text-sm md:text-base text-stone-500 text-center`}
        >
          {countdown}
        </p>
      </div>

      {/* Navigation */}
      <nav className="">
        {/* Mobile toggle button */}
        <div className="flex justify-between items-center px-6 md:hidden">
          <span className="font-semibold text-md">
            {!isOpen ? menuLabel.toUpperCase() : ''}
          </span>
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
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
          className={`
            flex flex-wrap justify-center gap-4 px-6
            md:flex-row md:items-center md:justify-center
            ${isOpen ? 'flex flex-col' : 'hidden'} md:flex
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
