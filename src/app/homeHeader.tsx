// homeHeader.tsx
import React from 'react';
import './header.css'; // Optional: for custom CSS if not using a framework like Tailwind

interface HeaderProps {
  logoSrc: string;
  coupleNames: string;
  eventDetails: string;
  countdown: string;
  navLinks: { label: string; href: string; }[];
}

const HomeHeader: React.FC<HeaderProps> = ({ logoSrc, coupleNames, eventDetails, countdown, navLinks }) => {
  return (
    <header className="header-container">
      {/* Image Section */}
      <div className="logo-section">
        <img src={logoSrc} alt="Wedding Logo" className="logo-image" />
        <h1 className="couple-names">{coupleNames}</h1>
        <p className="event-details">{eventDetails}</p>
        <p className="countdown">{countdown}</p>
      </div>

      {/* Navigation Bar Section */}
      <nav className="navbar">
        <ul className="nav-list">
          {navLinks.map((link) => (
            <li key={link.label} className="nav-item">
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default HomeHeader;
