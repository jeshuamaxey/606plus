'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { Card, CardImage, CardContent, CardHeader } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import Image from 'next/image';

export default function Layout1Page() {
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  
  const items = [
    { title: 'Braun KF 20 Coffee Maker', subtitle: 'Kitchenware · 1972', image: placeholderImage },
    { title: 'Max Bill Wristwatch', subtitle: 'Timepiece · 1961', image: placeholderImage },
    { title: 'Akari Light Sculptures', subtitle: 'Lighting · 1951-present', image: placeholderImage },
    { title: 'Juicy Salif', subtitle: 'Kitchenware · 1990', image: placeholderImage },
    { title: 'Lamy 2000 Fountain Pen', subtitle: 'Writing Instrument · 1966', image: placeholderImage },
    { title: 'Rotring 600 Mechanical Pencil', subtitle: 'Writing Instrument', image: placeholderImage },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Layout 1: Standard Grid</Heading>
          <BodyText className="mb-8">
            Traditional card grid layout with equal-width columns. Clean, predictable, and familiar.
          </BodyText>
          
          <Grid cols={3} gap="md">
            {items.map((item, index) => (
              <Card key={index}>
                <CardImage src={item.image} alt={item.title} />
                <CardContent>
                  <CardHeader title={item.title} subtitle={item.subtitle} />
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}

