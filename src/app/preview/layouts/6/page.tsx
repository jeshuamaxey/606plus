'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout6Page() {
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
          <Heading level={2} className="mb-4">Layout 6: Masonry Grid</Heading>
          <BodyText className="mb-8">
            A masonry-style layout with varying heights, creating visual interest through organic flow. 
            Objects are arranged to create a dynamic, non-uniform grid that breaks from rigid structure 
            while maintaining order.
          </BodyText>
          
          {/* Masonry grid using CSS columns */}
          <div 
            className="columns-1 md:columns-3 gap-4 md:gap-6"
            style={{ columnFill: 'balance' }}
          >
            {items.map((item, index) => {
              // Vary heights for visual interest
              const heights = ['aspect-square', 'aspect-[4/5]', 'aspect-[5/4]'];
              const heightClass = heights[index % heights.length];
              
              return (
                <div key={index} className="break-inside-avoid mb-4 md:mb-6 bg-white border border-neutral-200">
                  <div className={`${heightClass} relative bg-neutral-100`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </div>
  );
}

