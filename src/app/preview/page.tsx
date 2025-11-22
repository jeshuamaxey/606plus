'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Heading, BodyText, Label } from '@/components/ui/Typography';
import { Card, CardImage, CardContent, CardHeader } from '@/components/ui/Card';
import { Navigation, NavLink } from '@/components/ui/Navigation';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { Grid } from '@/components/ui/Grid';
import { ImageDisplay } from '@/components/ui/ImageDisplay';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Spacer } from '@/components/ui/Spacer';
import { NumberedList } from '@/components/ui/NumberedList';
import { Quote } from '@/components/ui/Quote';
import { MinimalCard } from '@/components/ui/variations/MinimalCard';
import { BoldCard } from '@/components/ui/variations/BoldCard';
import { GeometricButton } from '@/components/ui/variations/GeometricButton';
import { TechnicalCard } from '@/components/ui/variations/TechnicalCard';
import { ModularCard } from '@/components/ui/variations/ModularCard';
import { CraftCard } from '@/components/ui/variations/CraftCard';

export default function PreviewPage() {
  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/catalogue', label: 'Catalogue', active: true },
    { href: '/about', label: 'About', active: false },
  ];

  const numberedItems = [
    {
      number: '01',
      title: 'Function First',
      description: 'Every element serves a purpose. Form follows function in the purest sense.',
    },
    {
      number: '02',
      title: 'Precision',
      description: 'Exact measurements, clean lines, and careful consideration of every detail.',
    },
    {
      number: '03',
      title: 'Timelessness',
      description: 'Design that transcends trends and remains relevant across decades.',
    },
  ];

  // Placeholder images - using placeholder.com for demo
  const placeholderImage = 'https://placehold.co/600x600/e5e5e5/999999?text=Object';
  const placeholderWide = 'https://placehold.co/1200x800/e5e5e5/999999?text=Display';

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation links={navLinks} />

      {/* Hero Section */}
      <Section spacing="xl">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Heading level={1} className="mb-6">
              Vitsoe 606
            </Heading>
            <BodyText size="lg" className="mb-8 max-w-2xl mx-auto">
              A curated collection of objects that exemplify the principles of good design—functionality, 
              precision, and timeless beauty. Each piece has been selected for its ability to complement 
              the iconic 606 shelving system.
            </BodyText>
            <div className="flex gap-4 justify-center">
              <Button variant="primary">Explore Catalogue</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Typography Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Typography</Heading>
          
          <div className="space-y-8">
            <div>
              <Heading level={1}>Heading Level 1</Heading>
              <BodyText className="mt-2">Light weight, large size, tight tracking</BodyText>
            </div>
            
            <div>
              <Heading level={2}>Heading Level 2</Heading>
              <BodyText className="mt-2">Light weight, medium-large size</BodyText>
            </div>
            
            <div>
              <Heading level={3}>Heading Level 3</Heading>
              <BodyText className="mt-2">Normal weight, medium size</BodyText>
            </div>
            
            <div>
              <Heading level={4}>Heading Level 4</Heading>
              <BodyText className="mt-2">Normal weight, smaller size</BodyText>
            </div>
            
            <Divider />
            
            <div>
              <BodyText size="lg" weight="light">
                Large body text with light weight. Perfect for introductory paragraphs and 
                important statements that need breathing room.
              </BodyText>
            </div>
            
            <div>
              <BodyText size="md" weight="normal">
                Standard body text with normal weight. This is the default size for most 
                content, providing excellent readability while maintaining a clean, modern aesthetic.
              </BodyText>
            </div>
            
            <div>
              <BodyText size="sm" weight="normal">
                Small body text for captions, metadata, and supplementary information. 
                Maintains clarity even at reduced sizes.
              </BodyText>
            </div>
            
            <div>
              <Label>Label Text</Label>
              <BodyText size="sm" className="mt-1">
                Labels use uppercase with wide tracking for clear hierarchy
              </BodyText>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Buttons Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Buttons</Heading>
          
          <div className="space-y-6">
            <div>
              <Label className="mb-4 block">Variants</Label>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <Divider />
            
            <div>
              <Label className="mb-4 block">Sizes</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Cards Section */}
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-8">Cards</Heading>
          
          <Grid cols={3} gap="md">
            <Card>
              <CardImage src={placeholderImage} alt="Example object" />
              <CardContent>
                <CardHeader 
                  title="Braun KF 20 Coffee Maker"
                  subtitle="Kitchenware · 1972"
                />
                <BodyText size="sm" className="mt-4">
                  A classic example of Dieter Rams' design philosophy. Clean lines, 
                  functional form, timeless appeal.
                </BodyText>
                <div className="mt-4">
                  <Badge variant="outline">Dieter Rams Era</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardImage src={placeholderImage} alt="Example object" aspectRatio="portrait" />
              <CardContent>
                <CardHeader 
                  title="Max Bill Wristwatch"
                  subtitle="Timepiece · 1961"
                />
                <BodyText size="sm" className="mt-4">
                  Bauhaus principles applied to timekeeping. Minimalist design that 
                  emphasizes clarity and precision.
                </BodyText>
                <div className="mt-4">
                  <Badge variant="subtle">Bauhaus</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardImage src={placeholderImage} alt="Example object" />
              <CardContent>
                <CardHeader 
                  title="Akari Light Sculptures"
                  subtitle="Lighting · 1951-present"
                />
                <BodyText size="sm" className="mt-4">
                  Handmade washi paper forms that transform light into sculpture. 
                  A perfect balance of craft and design.
                </BodyText>
                <div className="mt-4">
                  <Badge variant="default">Isamu Noguchi</Badge>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>

      <Divider />

      {/* Image Display Section */}
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-8">Image Display</Heading>
          
          <div className="space-y-12">
            <div>
              <Label className="mb-4 block">Landscape</Label>
              <ImageDisplay 
                src={placeholderWide} 
                alt="Landscape image"
                aspectRatio="landscape"
                caption="A landscape image with generous white space"
              />
            </div>
            
            <Grid cols={2} gap="md">
              <div>
                <Label className="mb-4 block">Square</Label>
                <ImageDisplay 
                  src={placeholderImage} 
                  alt="Square image"
                  aspectRatio="square"
                />
              </div>
              <div>
                <Label className="mb-4 block">Portrait</Label>
                <ImageDisplay 
                  src={placeholderImage} 
                  alt="Portrait image"
                  aspectRatio="portrait"
                />
              </div>
            </Grid>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Badges Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Badges</Heading>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="subtle">Subtle</Badge>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Numbered List Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Numbered List</Heading>
          <NumberedList items={numberedItems} />
        </Container>
      </Section>

      <Divider />

      {/* Quote Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Quote</Heading>
          <Quote 
            text="Good design is as little design as possible. Less, but better—because it concentrates on the essential aspects, and the products are not burdened with non-essentials."
            author="Dieter Rams"
          />
        </Container>
      </Section>

      <Divider />

      {/* Grid System Section */}
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-8">Grid System</Heading>
          
          <div className="space-y-12">
            <div>
              <Label className="mb-4 block">2 Columns</Label>
              <Grid cols={2} gap="md">
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>Column 1</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>Column 2</BodyText>
                </div>
              </Grid>
            </div>
            
            <div>
              <Label className="mb-4 block">3 Columns</Label>
              <Grid cols={3} gap="md">
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>Column 1</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>Column 2</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>Column 3</BodyText>
                </div>
              </Grid>
            </div>
            
            <div>
              <Label className="mb-4 block">4 Columns</Label>
              <Grid cols={4} gap="md">
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>1</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>2</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>3</BodyText>
                </div>
                <div className="bg-neutral-50 p-8 border border-neutral-200">
                  <BodyText>4</BodyText>
                </div>
              </Grid>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Spacing Section */}
      <Section spacing="lg">
        <Container size="md">
          <Heading level={2} className="mb-8">Spacing</Heading>
          
          <div className="space-y-4">
            <div>
              <Label>Extra Small</Label>
              <div className="bg-neutral-100 border-l-4 border-neutral-900">
                <Spacer size="xs" />
              </div>
            </div>
            <div>
              <Label>Small</Label>
              <div className="bg-neutral-100 border-l-4 border-neutral-900">
                <Spacer size="sm" />
              </div>
            </div>
            <div>
              <Label>Medium</Label>
              <div className="bg-neutral-100 border-l-4 border-neutral-900">
                <Spacer size="md" />
              </div>
            </div>
            <div>
              <Label>Large</Label>
              <div className="bg-neutral-100 border-l-4 border-neutral-900">
                <Spacer size="lg" />
              </div>
            </div>
            <div>
              <Label>Extra Large</Label>
              <div className="bg-neutral-100 border-l-4 border-neutral-900">
                <Spacer size="xl" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Alternative Component Variations */}
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-8">Alternative Styling Directions</Heading>
          
          <div className="space-y-16">
            {/* Minimal Direction */}
            <div>
              <Heading level={3} className="mb-6">Minimal Direction</Heading>
              <BodyText className="mb-8 max-w-2xl">
                Ultra-minimal approach with maximum white space, subtle interactions, and 
                light typography weights. Emphasizes the objects themselves.
              </BodyText>
              <Grid cols={3} gap="lg">
                <MinimalCard
                  image={placeholderImage}
                  title="Braun KF 20"
                  meta="1972 · Kitchenware"
                />
                <MinimalCard
                  image={placeholderImage}
                  title="Max Bill Watch"
                  meta="1961 · Timepiece"
                />
                <MinimalCard
                  image={placeholderImage}
                  title="Akari Light"
                  meta="1951 · Lighting"
                />
              </Grid>
            </div>

            <Divider />

            {/* Bold Direction */}
            <div>
              <Heading level={3} className="mb-6">Bold Direction</Heading>
              <BodyText className="mb-8 max-w-2xl">
                Strong geometric forms with bold borders and numbered elements. 
                More assertive presence while maintaining clarity.
              </BodyText>
              <Grid cols={2} gap="md">
                <BoldCard
                  image={placeholderWide}
                  title="Dieter Rams Era"
                  description="The Braun design philosophy of 'less but better' revolutionized industrial design in the 1960s and 70s."
                  number="01"
                />
                <BoldCard
                  image={placeholderWide}
                  title="Vitsoe Principles"
                  description="Precision engineering meets timeless aesthetics. The 606 system embodies modularity and permanence."
                  number="02"
                />
              </Grid>
            </div>

            <Divider />

            {/* Geometric Button Variations */}
            <div>
              <Heading level={3} className="mb-6">Geometric Button Variations</Heading>
              <BodyText className="mb-8 max-w-2xl">
                Button styles with strong geometric forms, inspired by industrial design 
                and technical precision.
              </BodyText>
              <div className="flex flex-wrap gap-4">
                <GeometricButton variant="square">Square</GeometricButton>
                <GeometricButton variant="rounded">Rounded</GeometricButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      {/* Novel Design Directions */}
      <Section spacing="lg">
        <Container size="lg">
          <Heading level={2} className="mb-4">Novel Design Directions</Heading>
          <BodyText size="lg" className="mb-12 max-w-3xl">
            Three distinct design directions exploring different aspects of the Vitsoe 606 catalogue, 
            each with its own visual language and inspiration.
          </BodyText>

          {/* Technical Drawing Direction */}
          <div className="mb-16">
            <div className="mb-6">
              <Heading level={3} className="mb-3">Technical Drawing / Blueprint Direction</Heading>
              <BodyText className="mb-4 max-w-2xl">
                Inspired by technical drawings, architectural plans, and measurement tools from the catalogue 
                (combination squares, marking gauges, machinist's blocks). Features ruled lines, measurement 
                indicators, technical annotations, and a blueprint-inspired color palette.
              </BodyText>
            </div>
            <Grid cols={3} gap="md">
              <TechnicalCard
                image={placeholderImage}
                title="BRAUN KF 20"
                subtitle="COFFEE MAKER · 1972"
                description="A classic example of Dieter Rams' design philosophy. Clean lines, functional form, timeless appeal."
                dimensions="240×180×280"
                annotations={[
                  "Precision-engineered housing",
                  "Functional button layout",
                  "Timeless aesthetic"
                ]}
              />
              <TechnicalCard
                image={placeholderImage}
                title="MAX BILL WATCH"
                subtitle="TIMEPIECE · 1961"
                description="Bauhaus principles applied to timekeeping. Minimalist design emphasizing clarity and precision."
                dimensions="Ø 34mm"
                annotations={[
                  "Swiss precision movement",
                  "Bauhaus typography",
                  "Functional elegance"
                ]}
              />
              <TechnicalCard
                image={placeholderImage}
                title="COMBINATION SQUARE"
                subtitle="TOOL · STARRETT"
                description="Machinist's precision instrument. Exact measurements, clean lines, careful consideration of every detail."
                dimensions="300×50×25"
                annotations={[
                  "Hardened steel blade",
                  "Precision-ground edges",
                  "Industrial accuracy"
                ]}
              />
            </Grid>
          </div>

          <Divider className="my-16" />

          {/* Modular System Direction */}
          <div className="mb-16">
            <div className="mb-6">
              <Heading level={3} className="mb-3">Modular System / Grid Direction</Heading>
              <BodyText className="mb-4 max-w-2xl">
                Inspired by the modular nature of the 606 shelving system itself. Emphasizes visible grid 
                structure, connection points, modular units that suggest combinability, and system thinking 
                with repeatable patterns.
              </BodyText>
            </div>
            <Grid cols={3} gap="md">
              <ModularCard
                image={placeholderImage}
                title="606 Shelf Unit"
                subtitle="FURNITURE SYSTEM"
                description="Precision engineering meets timeless aesthetics. The 606 system embodies modularity and permanence."
                unitNumber="A-01"
                connectionPoints={4}
              />
              <ModularCard
                image={placeholderImage}
                title="Modular Storage"
                subtitle="SYSTEM COMPONENT"
                description="Designed to connect seamlessly with other units. Each module functions independently yet enhances the whole."
                unitNumber="B-02"
                connectionPoints={6}
              />
              <ModularCard
                image={placeholderImage}
                title="Grid System"
                subtitle="DESIGN FRAMEWORK"
                description="Visible structure emphasizes the underlying grid. Connection points suggest infinite combinability."
                unitNumber="C-03"
                connectionPoints={4}
              />
            </Grid>
          </div>

          <Divider className="my-16" />

          {/* Craft/Material Direction */}
          <div className="mb-16">
            <div className="mb-6">
              <Heading level={3} className="mb-3">Craft / Material Direction</Heading>
              <BodyText className="mb-4 max-w-2xl">
                Inspired by handmade objects in the catalogue (ceramics, woodworking tools, hand planes). 
                Emphasizes material textures, hand-drawn elements, craft-specific details, and material-inspired 
                color palettes that celebrate the maker's hand.
              </BodyText>
            </div>
            <Grid cols={3} gap="md">
              <CraftCard
                image={placeholderImage}
                title="Lucie Rie Footed Bowl"
                subtitle="Thin-walled porcelain"
                description="Hand-thrown ceramic vessel with sgraffito decoration. The maker's touch is evident in every curve."
                material="ceramic"
                maker="Lucie Rie"
              />
              <CraftCard
                image={placeholderImage}
                title="Japanese Hand Plane"
                subtitle="Oak body, laminated steel"
                description="Traditional woodworking tool. The patina of use tells the story of countless hours of careful work."
                material="wood"
                maker="Traditional"
              />
              <CraftCard
                image={placeholderImage}
                title="Akari Light Sculpture"
                subtitle="Handmade washi paper"
                description="Handcrafted paper forms that transform light into sculpture. A perfect balance of craft and design."
                material="paper"
                maker="Isamu Noguchi"
              />
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section spacing="md">
        <Container size="lg">
          <Divider className="mb-8" />
          <div className="text-center">
            <BodyText size="sm" className="text-neutral-500">
              Vitsoe 606 Catalogue — An homage to timeless design
            </BodyText>
          </div>
          <Spacer size="md" />
        </Container>
      </Section>
    </div>
  );
}

