'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';

interface ScrollAwareNavigationProps {
  links: Array<{ href: string; label: string; active?: boolean }>;
}

export const ScrollAwareNavigation: React.FC<ScrollAwareNavigationProps> = ({ links }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('home-header');
      if (header) {
        const headerBottom = header.offsetTop + header.offsetHeight;
        setIsVisible(window.scrollY > headerBottom);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Navigation links={links} />
    </div>
  );
};

