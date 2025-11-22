'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout4Page() {
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  
  const items = [
    { title: 'Braun KF 20', subtitle: '1972', image: placeholderImage },
    { title: 'Max Bill Watch', subtitle: '1961', image: placeholderImage },
    { title: 'Akari Light', subtitle: '1951', image: placeholderImage },
    { title: 'Juicy Salif', subtitle: '1990', image: placeholderImage },
    { title: 'Lamy 2000', subtitle: '1966', image: placeholderImage },
    { title: 'Rotring 600', subtitle: 'Modern', image: placeholderImage },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Layout 4: Asymmetric Columns (4-Column)</Heading>
          <BodyText className="mb-8">
            Four-column layout with alternating widths inspired by 606's modular system. 
            Two narrow columns (1 unit) and two wider columns (2 units), creating a 
            rhythm that echoes the flexibility of the shelving system.
          </BodyText>
          
          {/* Four column layout: narrow-wide-narrow-wide (1:2:1:2 ratio) */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Column 1: Narrow */}
            <div className="col-span-12 md:col-span-2 space-y-4 md:space-y-6">
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-square relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 16.67vw"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Column 2: Wide */}
            <div className="col-span-12 md:col-span-4 space-y-4 md:space-y-6">
              {items.slice(2, 3).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-[4/3] relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33.33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-medium text-neutral-900 mb-2">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide mb-2">{item.subtitle}</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      Featured object in wider column with more space for description.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Column 3: Narrow */}
            <div className="col-span-12 md:col-span-2 space-y-4 md:space-y-6">
              {items.slice(3, 5).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-square relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 16.67vw"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Column 4: Wide */}
            <div className="col-span-12 md:col-span-4 space-y-4 md:space-y-6">
              {items.slice(5, 6).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-[4/3] relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33.33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-medium text-neutral-900 mb-2">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide mb-2">{item.subtitle}</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      Another featured object demonstrating the alternating rhythm.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

