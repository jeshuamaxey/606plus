'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout9Page() {
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
        <Container size="full">
          <div className="mb-8 px-6 md:px-8">
            <Heading level={2} className="mb-4">Layout 9: Alternating Full Bleed</Heading>
            <BodyText>
              Full-width rows alternating image positions (left/right), creating a zigzag visual flow. 
              Each object gets maximum visual impact while maintaining rhythm through alternating layout.
            </BodyText>
          </div>
          
          <div className="space-y-0">
            {items.slice(0, 4).map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className="border-b border-neutral-200 last:border-b-0">
                  <div className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image */}
                    <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[500px] relative bg-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                      <div className="max-w-lg mx-auto">
                        <h3 className="text-3xl md:text-4xl font-light text-neutral-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm text-neutral-600 uppercase tracking-wider mb-6">
                          {item.subtitle}
                        </p>
                        <p className="text-base text-neutral-700 leading-relaxed">
                          A featured object displayed in full-width format with alternating 
                          image positions creating visual rhythm and interest.
                        </p>
                      </div>
                    </div>
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

