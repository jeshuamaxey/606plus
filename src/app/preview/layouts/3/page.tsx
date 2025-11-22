'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout3Page() {
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  
  const items = [
    { title: 'Braun KF 20', subtitle: '1972', image: placeholderImage },
    { title: 'Max Bill Watch', subtitle: '1961', image: placeholderImage },
    { title: 'Akari Light', subtitle: '1951', image: placeholderImage },
    { title: 'Juicy Salif', subtitle: '1990', image: placeholderImage },
    { title: 'Lamy 2000', subtitle: '1966', image: placeholderImage },
    { title: 'Rotring 600', subtitle: 'Modern', image: placeholderImage },
    { title: 'Leica M-Series', subtitle: 'Vintage', image: placeholderImage },
    { title: 'Eames Chair', subtitle: 'Vitra', image: placeholderImage },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Layout 3: Asymmetric Columns (3-Column)</Heading>
          <BodyText className="mb-8">
            Inspired by Vitsoe 606's modular widths. Two narrow columns flank a wider center column, 
            creating visual hierarchy and rhythm. The wider center column accommodates featured items, 
            while side columns display supporting objects.
          </BodyText>
          
          {/* Three column layout: narrow-wide-narrow (1:2:1 ratio) */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Left narrow column */}
            <div className="col-span-12 md:col-span-3 space-y-4 md:space-y-6">
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-square relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Center wide column */}
            <div className="col-span-12 md:col-span-6 space-y-4 md:space-y-6">
              {items.slice(2, 4).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-[4/3] relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-medium text-neutral-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-neutral-600 uppercase tracking-wide mb-3">{item.subtitle}</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      A featured object displayed with more prominence in the wider center column.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right narrow column */}
            <div className="col-span-12 md:col-span-3 space-y-4 md:space-y-6">
              {items.slice(4, 6).map((item, index) => (
                <div key={index} className="bg-white border border-neutral-200">
                  <div className="aspect-square relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-600 uppercase tracking-wide">{item.subtitle}</p>
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

