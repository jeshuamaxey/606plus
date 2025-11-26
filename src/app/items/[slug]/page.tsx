import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText, Label } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { Spacer } from '@/components/ui/Spacer';
import { ETrack } from '@/components/ui/ETrack';
import { getItemBySlug, buildLargeImageUrl } from '@/lib/sanity';
import type { ItemDetail } from '@/lib/sanity';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Format year range display
 */
function formatYearRange(yearStart?: number, yearEnd?: number): string {
  if (!yearStart) return '';
  
  if (yearEnd && yearEnd !== yearStart) {
    return `${yearStart}–${yearEnd}`;
  }
  
  return yearStart.toString();
}

export default async function ItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/about', label: 'About', active: false },
  ];

  const firstImage = item.images?.[0];
  const primaryImageUrl = firstImage ? buildLargeImageUrl(firstImage) : '';
  const primaryImageAlt = firstImage?.alt || item.name;
  const additionalImages = item.images?.slice(1).map((img) => ({
    url: buildLargeImageUrl(img),
    alt: img.alt || `${item.name} - additional view`,
  })).filter((img) => img.url) || [];
  const yearDisplay = formatYearRange(item.yearStart, item.yearEnd);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="lg">
          <Container size="lg">
            {/* Asymmetric 2-column layout: 2/3 left, 1/3 right */}
            <div className="relative">
              {/* Left edge track */}
              <ETrack position="left" className="left-0" />
              
              {/* Track between columns (at 66.66% - 2/3 mark) */}
              <ETrack 
                position="between" 
                className="hidden lg:block"
                style={{ left: '66.666%' }}
              />
              
              {/* Right edge track */}
              <ETrack position="right" className="right-0" />
              
              {/* Grid with padding to account for tracks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pl-0 lg:pl-6 pr-0 lg:pr-6">
              {/* Left Column - 2/3 width (2 columns out of 3) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Primary Image */}
                {primaryImageUrl && (
                  <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <Image
                      src={primaryImageUrl}
                      alt={primaryImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                )}

                {/* Additional Images */}
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                ))}
              </div>

              {/* Right Column - 1/3 width (1 column out of 3) */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Item Number */}
                  {item.number && (
                    <div>
                      <Label className="text-xs">#{item.number}</Label>
                    </div>
                  )}

                  {/* Item Name */}
                  <Heading level={1} className="mb-4">
                    {item.name}
                  </Heading>

                  {/* Category Badge */}
                  {item.category?.name && (
                    <div className="mb-6">
                      <Badge variant="outline">{item.category.name}</Badge>
                    </div>
                  )}

                  <Divider />

                  {/* Metadata Section */}
                  <div className="space-y-4">
                    {/* Designer */}
                    {item.designer?.name && (
                      <div>
                        <Label className="text-xs mb-1 block">Designer</Label>
                        <BodyText size="sm">{item.designer.name}</BodyText>
                      </div>
                    )}

                    {/* Brand */}
                    {item.brand?.name && (
                      <div>
                        <Label className="text-xs mb-1 block">Brand</Label>
                        <BodyText size="sm">{item.brand.name}</BodyText>
                      </div>
                    )}

                    {/* Year */}
                    {yearDisplay && (
                      <div>
                        <Label className="text-xs mb-1 block">Year</Label>
                        <BodyText size="sm">{yearDisplay}</BodyText>
                      </div>
                    )}

                    {/* Materials */}
                    {item.materials && (
                      <div>
                        <Label className="text-xs mb-1 block">Materials</Label>
                        <BodyText size="sm">{item.materials}</BodyText>
                      </div>
                    )}

                    {/* Dimensions */}
                    {item.dimensions && (
                      <div>
                        <Label className="text-xs mb-1 block">Dimensions</Label>
                        <BodyText size="sm">{item.dimensions}</BodyText>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <>
                      <Divider />
                      <div>
                        <BodyText size="md" weight="light" className="leading-relaxed">
                          {item.description}
                        </BodyText>
                      </div>
                    </>
                  )}
                </div>
              </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

