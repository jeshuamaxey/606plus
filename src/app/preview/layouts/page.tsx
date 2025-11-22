'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { Grid } from '@/components/ui/Grid';

export default function LayoutsIndexPage() {
  const layouts = [
    {
      number: 1,
      title: 'Standard Grid',
      description: 'Traditional card grid layout with equal-width columns',
      path: '/preview/layouts/1',
    },
    {
      number: 2,
      title: 'Full Bleed Rows',
      description: 'Objects displayed in full-width rows with side-by-side content',
      path: '/preview/layouts/2',
    },
    {
      number: 3,
      title: 'Asymmetric Columns (3-Column)',
      description: 'Narrow-wide-narrow column layout inspired by 606 modular widths',
      path: '/preview/layouts/3',
    },
    {
      number: 4,
      title: 'Asymmetric Columns (4-Column)',
      description: 'Four-column layout with alternating narrow and wide columns',
      path: '/preview/layouts/4',
    },
    {
      number: 5,
      title: 'E-Track Inspired',
      description: 'Vertical tracks with hanging objects, mimicking the 606 E-Track system',
      path: '/preview/layouts/5',
    },
    {
      number: 6,
      title: 'Masonry Grid',
      description: 'Varying heights creating organic flow in a masonry-style layout',
      path: '/preview/layouts/6',
    },
    {
      number: 7,
      title: 'List with Inline Images',
      description: 'Compact list layout prioritizing information density',
      path: '/preview/layouts/7',
    },
    {
      number: 8,
      title: 'Modular Units',
      description: 'Discrete units with connection points and identifiers',
      path: '/preview/layouts/8',
    },
    {
      number: 9,
      title: 'Alternating Full Bleed',
      description: 'Full-width rows with alternating image positions',
      path: '/preview/layouts/9',
    },
    {
      number: 10,
      title: 'E-Track Row-Based',
      description: 'Row-based layout with continuous vertical e-tracks, items arranged horizontally',
      path: '/preview/layouts/10',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={1} className="mb-4">Catalogue Layout Explorations</Heading>
          <BodyText size="lg" className="mb-12 max-w-3xl">
            A collection of layout patterns for displaying catalogue objects, inspired by the 
            Vitsoe 606 Universal Shelving System. Each layout explores different approaches to 
            organizing and presenting objects, from traditional grids to more experimental arrangements.
          </BodyText>
          
          <Grid cols={2} gap="md">
            {layouts.map((layout) => (
              <Link
                key={layout.number}
                href={layout.path}
                className="block p-6 border border-neutral-200 hover:border-neutral-900 transition-colors group"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 border-2 border-neutral-900 flex items-center justify-center text-lg font-mono text-neutral-900">
                    {layout.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-neutral-900 mb-2 group-hover:underline">
                      {layout.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {layout.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        </Container>
      </Section>
    </div>
  );
}

