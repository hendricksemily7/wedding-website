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
  // eventDetails: string;
  navLinksList: { label: string; href: string, target: string }[];
}

const SharedHeader: React.FC<HeaderProps> = ({
  coupleNames,
  // eventDetails,
  navLinksList,
}) => {
  const pathname = usePathname() as string;
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const menuLabel = navLinksDict[pathname] || "";

  return (
    <header className="">
      <div className="w-full mx-auto px-4 md:px-8">        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* info section */}
          <h1 className={`${playfair.className} text-xl md:text-2xl text-left`}>
            {coupleNames}
          </h1>
          {/* Navigation */}
          <nav className="w-full md:w-auto md:flex-1">
            {/* Mobile toggle button */}
            <div className="flex text-right md:hidden text-xl">
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
                flex flex-wrap gap-4 text-xl
                md:flex-row md:items-center md:justify-end
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
                        px-3 py-2 rounded transition-colors
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
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;
