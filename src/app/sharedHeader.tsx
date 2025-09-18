// sharedHeader.tsx
'use client'; // This directive is required for usePathname
import React from 'react';
import { usePathname } from 'next/navigation'; // Import the hook
import Link from 'next/link'; // Use the Next.js Link component
import './sharedHeader.css'; // Optional: for custom CSS if not using a framework like Tailwind

// TODO: make shared if we're keeping them consistent
interface HeaderProps {
  logoSrc: string;
  coupleNames: string;
  eventDetails: string;
  countdown: string;
  navLinks: { label: string; href: string; }[];
}

const SharedHeader: React.FC<HeaderProps> = ({  logoSrc, coupleNames, eventDetails, countdown, navLinks }) => {
  const pathname = usePathname(); // Get the current path

  return (    
    <header className="header-container">
      <div className="logo-section">
        <h1 className="couple-names">{coupleNames}</h1>
        <p className="event-details">{eventDetails}</p>
        <p className="countdown">{countdown}</p>
      </div>
      <nav className="navbar">
        <ul className="nav-list">
          {/* {navLinks.map((link) => (
            // check if the current path matches the link's href
            <li key={link.label} className="nav-item">
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))} */}
         {navLinks.map((link) => {
          // check if the current path matches the link's href
          const isActive = pathname === link.href;
          return (
            <li key={link.label} className="nav-item">
              <Link
                href={link.href}
                // conditionally apply the active class
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
        </ul>
      </nav>
    </header>
  );
};

export default SharedHeader;
