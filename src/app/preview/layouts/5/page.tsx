'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { ETrackGrid } from '@/components/ui/ETrackGrid';

export default function Layout5Page() {
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
          <Heading level={2} className="mb-4">Layout 5: E-Track Inspired</Heading>
          <BodyText className="mb-8">
            Layout inspired by the 606 E-Track system. Vertical tracks (columns) with objects 
            hanging at various heights, creating an organic, modular arrangement. Objects can 
            be repositioned visually, mimicking the tool-free reconfiguration of the shelving system.
            This implementation features three columns with vertical e-tracks between each column 
            and on the left and right edges of the grid.
          </BodyText>
          
          {/* Three-column grid with e-tracks */}
          <ETrackGrid
            items={items}
            columns={3}
            gap="sm"
            itemSpacing="md"
            showEdgeTracks={true}
            showBetweenTracks={true}
          />
        </Container>
      </Section>
    </div>
  );
}

