'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import Image from 'next/image';

export default function Layout2Page() {
  const placeholderImage = 'https://placehold.co/1200x600/e5e5e5/999999?text=Object';
  
  const items = [
    { 
      title: 'Braun KF 20 Coffee Maker', 
      subtitle: 'Kitchenware · 1972',
      description: 'A classic example of Dieter Rams\' design philosophy. Clean lines, functional form, timeless appeal.',
      image: placeholderImage 
    },
    { 
      title: 'Max Bill Wristwatch', 
      subtitle: 'Timepiece · 1961',
      description: 'Bauhaus principles applied to timekeeping. Minimalist design that emphasizes clarity and precision.',
      image: placeholderImage 
    },
    { 
      title: 'Akari Light Sculptures', 
      subtitle: 'Lighting · 1951-present',
      description: 'Handmade washi paper forms that transform light into sculpture. A perfect balance of craft and design.',
      image: placeholderImage 
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="full">
          <div className="mb-8 px-6 md:px-8">
            <Heading level={2} className="mb-4">Layout 2: Full Bleed Rows</Heading>
            <BodyText>
              Objects displayed in full-width rows, creating a strong visual rhythm and allowing 
              images to command attention. Inspired by the uninterrupted flow of the 606 E-Track system.
            </BodyText>
          </div>
          
          <div className="space-y-0">
            {items.map((item, index) => (
              <div key={index} className="border-b border-neutral-200 last:border-b-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image - full height */}
                  <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:h-[400px] relative bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-light text-neutral-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 uppercase tracking-wider mb-4">
                      {item.subtitle}
                    </p>
                    <p className="text-base text-neutral-700 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
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

