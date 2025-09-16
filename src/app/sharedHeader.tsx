// Header.tsx
import React from 'react';
import './header.css'; // Optional: for custom CSS if not using a framework like Tailwind

interface HeaderProps {
  logoSrc: string;
  navLinks: { label: string; href: string; }[];
}

const SharedHeader: React.FC<HeaderProps> = ({ logoSrc, navLinks }) => {
  return (
    <header className="header-container">
      {/* Image Section */}
      <div className="logo-section">
        <img src={logoSrc} alt="Wedding Logo" className="logo-image" />
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

export default SharedHeader;
