import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, active = false }) => {
  return (
    <Link
      href={href}
      className={`text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${
        active
          ? 'text-neutral-900 border-b-2 border-neutral-900'
          : 'text-neutral-600 hover:text-neutral-900'
      }`}
    >
      {children}
    </Link>
  );
};

interface NavigationProps {
  links: Array<{ href: string; label: string; active?: boolean }>;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ links, className = '' }) => {
  return (
    <nav className={`border-b border-neutral-200 ${className}`}>
      <div className="max-w-7xl mx-2 md:mx-auto px-2 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            href="/" 
            className="text-2xl font-light tracking-tight text-neutral-900"
            style={{ fontFamily: 'var(--font-stack-sans-notch), var(--font-geist-sans), sans-serif' }}
          >
            606 + <span className="text-neutral-600 border-b border-neutral-600">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </Link>
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} active={link.active}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

