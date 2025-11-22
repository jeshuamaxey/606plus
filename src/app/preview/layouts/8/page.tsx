'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout8Page() {
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
          <Heading level={2} className="mb-4">Layout 8: Modular Units</Heading>
          <BodyText className="mb-8">
            Layout inspired by the modular nature of 606 components. Objects are displayed as 
            discrete units that can be rearranged, with visible connection points and unit identifiers. 
            Emphasizes the system's adaptability and component-based architecture.
          </BodyText>
          
          {/* Modular grid with unit indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, index) => (
              <div key={index} className="relative group">
                {/* Unit number badge */}
                <div className="absolute -top-2 -left-2 z-10 bg-neutral-900 text-white text-[10px] font-mono px-2 py-1">
                  UNIT {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Connection indicators */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 bottom-0 right-0 w-1 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="bg-white border-2 border-neutral-300 group-hover:border-neutral-900 transition-colors">
                  <div className="aspect-square relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
                    
                    {/* Connection points */}
                    <div className="mt-3 flex justify-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 border border-neutral-400 bg-neutral-100 opacity-60"
                        />
                      ))}
                    </div>
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

