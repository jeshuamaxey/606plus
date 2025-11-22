import React from 'react';

interface FooterProps {
  className?: string;
}

/**
 * Footer component - minimalist footer with "less, but better" text
 */
export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-neutral-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-center h-20">
          <p className="text-sm text-neutral-600 font-light tracking-wide">
            less, but better
          </p>
        </div>
      </div>
    </footer>
  );
}

