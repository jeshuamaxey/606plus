'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { ETrackRowGrid } from '@/components/ui/ETrackRowGrid';

export default function Layout10Page() {
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  
  const items = [
    { title: 'Braun KF 20 Coffee Maker', subtitle: 'Kitchenware · 1972', image: placeholderImage },
    { title: 'Max Bill Wristwatch', subtitle: 'Timepiece · 1961', image: placeholderImage },
    { title: 'Akari Light Sculptures', subtitle: 'Lighting · 1951', image: placeholderImage },
    { title: 'Juicy Salif', subtitle: 'Kitchenware · 1990', image: placeholderImage },
    { title: 'Lamy 2000 Fountain Pen', subtitle: 'Writing Instrument · 1966', image: placeholderImage },
    { title: 'Rotring 600', subtitle: 'Writing Instrument', image: placeholderImage },
    { title: 'Dieter Rams Calculator', subtitle: 'Electronics · 1987', image: placeholderImage },
    { title: 'Eames Lounge Chair', subtitle: 'Furniture · 1956', image: placeholderImage },
    { title: 'Noguchi Coffee Table', subtitle: 'Furniture · 1944', image: placeholderImage },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Layout 10: E-Track Row-Based</Heading>
          <BodyText className="mb-8">
            Row-based e-track layout where items are arranged horizontally in rows. 
            Vertical e-tracks run continuously down the page, creating uninterrupted 
            vertical lines. Items flow from left to right, row by row, making this 
            ideal for sequential data rendering. With no vertical spacing between rows, 
            the tracks appear as continuous vertical lines.
          </BodyText>
          
          {/* Row-based grid with continuous e-tracks */}
          <ETrackRowGrid
            items={items}
            columns={3}
            rowSpacing="none"
            itemPadding="xs"
            showEdgeTracks={true}
            showBetweenTracks={true}
          />
        </Container>
      </Section>
    </div>
  );
}

