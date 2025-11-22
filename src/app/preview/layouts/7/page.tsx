'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout7Page() {
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  
  const items = [
    { title: 'Braun KF 20 Coffee Maker', subtitle: 'Kitchenware · 1972', image: placeholderImage },
    { title: 'Max Bill Wristwatch', subtitle: 'Timepiece · 1961', image: placeholderImage },
    { title: 'Akari Light Sculptures', subtitle: 'Lighting · 1951', image: placeholderImage },
    { title: 'Juicy Salif', subtitle: 'Kitchenware · 1990', image: placeholderImage },
    { title: 'Lamy 2000 Fountain Pen', subtitle: 'Writing Instrument · 1966', image: placeholderImage },
    { title: 'Rotring 600', subtitle: 'Writing Instrument', image: placeholderImage },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Layout 7: List with Inline Images</Heading>
          <BodyText className="mb-8">
            A compact list layout with images integrated inline. Efficient use of space, 
            prioritizing information density while maintaining readability. Inspired by 
            technical documentation and catalog systems.
          </BodyText>
          
          <div className="space-y-0 border border-neutral-200">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-6 p-6 border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50 transition-colors"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative bg-neutral-100 border border-neutral-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg font-medium text-neutral-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-neutral-600 uppercase tracking-wide">
                    {item.subtitle}
                  </p>
                </div>
                
                {/* Year indicator */}
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-16 h-16 border-2 border-neutral-300 flex items-center justify-center">
                    <span className="text-xs font-mono text-neutral-600">
                      {item.subtitle.split('·')[1]?.trim() || '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

