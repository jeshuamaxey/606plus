import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

/**
 * Footer component - minimalist footer with "less, but better" text
 */
export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-neutral-200 ${className}`}>
      <div className="max-w-7xl mx-auto p-6 md:px-8">
        <div className="flex flex-col justify-center h-20 gap-6">
          <p className="text-sm text-neutral-500 font-light">
            Curated by{' '}
            <Link 
              href="https://jeshua.co" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Jeshua Maxey
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

