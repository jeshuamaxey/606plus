import { ScrollAwareNavigation } from '@/components/ui/ScrollAwareNavigation';
import { ETrackRowGrid } from '@/components/ui/ETrackRowGrid';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { getHomepageItems } from '@/lib/sanity';
import type { Metadata } from 'next';
import {
  generateCollectionPageSchema,
  generateItemListSchema,
  generatePersonSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
} from '@/lib/structured-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

export async function generateMetadata(): Promise<Metadata> {
  const items = await getHomepageItems();
  const itemCount = items.length;

  return {
    title: "606+ | Design object catalogue",
    description: `A curated collection of ${itemCount} design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.`,
    openGraph: {
      title: "606+ | Design object catalogue",
      description: `A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.`,
      url: siteUrl,
      images: [
        {
          url: `${siteUrl}/606-Universal-Shelving-System.jpg`,
          width: 1200,
          height: 630,
          alt: "Vitsoe 606 Universal Shelving System",
        },
      ],
    },
    twitter: {
      title: "606+ | Design object catalogue",
      description: `A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.`,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default async function Home() {
  const items = await getHomepageItems();

  const navLinks = [
    { href: '/', label: 'Home', active: true },
    { href: '/about', label: 'About', active: false },
    { href: '/my-606', label: 'My 606', active: false },
  ];

  // Generate structured data
  const collectionPageSchema = generateCollectionPageSchema();
  const itemListSchema = generateItemListSchema(
    items.map((item) => ({
      title: item.title,
      href: item.href,
      subtitle: item.subtitle,
    }))
  );
  const personSchema = generatePersonSchema('Jeshua Maxey', 'https://jeshua.co', 'me@jeshua.co');
  const webSiteSchema = generateWebSiteSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ScrollAwareNavigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="lg" className="py-0 md:py-12">
          <Container size="lg">
            {/* Hero Section with H1 */}
            <div id="home-header" className="mb-12 text-left max-w-3xl">
              <Heading level={1} className="mb-4">
                606+
              </Heading>

              <BodyText size="lg" weight="light" className="text-neutral-600">
                A curated collection of design objects that complement the Vitsoe 606 shelving system. 
                Pleasing to the eye, rewarding to explore.
              </BodyText>
            </div>

            <ETrackRowGrid
              items={items}
              columns={3}
              rowSpacing="none"
            />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
