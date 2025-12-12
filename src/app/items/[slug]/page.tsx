import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText, Label } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { Spacer } from '@/components/ui/Spacer';
import { ETrack } from '@/components/ui/ETrack';
import { getItemBySlug, buildLargeImageUrl, getRelatedItems } from '@/lib/sanity';
import type { ItemDetail } from '@/lib/sanity';
import type { Metadata } from 'next';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generatePersonSchema,
} from '@/lib/structured-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

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

/**
 * Generate meta description for item
 */
function generateMetaDescription(item: ItemDetail): string {
  const parts: string[] = [];
  
  parts.push(`The ${item.name}`);
  
  if (item.designer?.name) {
    parts.push(`by ${item.designer.name}`);
  }
  
  if (item.category?.name) {
    parts.push(`- a ${item.category.name.toLowerCase()}`);
  }
  
  if (item.yearStart) {
    const yearDisplay = formatYearRange(item.yearStart, item.yearEnd);
    parts.push(`(${yearDisplay})`);
  }
  
  parts.push('that complements the Vitsoe 606 shelving system.');
  
  if (item.description) {
    const desc = item.description.length > 80 
      ? item.description.substring(0, 80) + '...'
      : item.description;
    parts.push(desc);
  }
  
  return parts.join(' ');
}

/**
 * Generate title for item page
 */
function generateTitle(item: ItemDetail): string {
  if (item.designer?.name) {
    return `${item.name} by ${item.designer.name} | 606+`;
  }
  if (item.yearStart) {
    const yearDisplay = formatYearRange(item.yearStart, item.yearEnd);
    return `${item.name} (${yearDisplay}) | 606+`;
  }
  return `${item.name} | 606+`;
}

/**
 * Generate enhanced alt text for images
 */
function generateImageAlt(item: ItemDetail, imageIndex: number = 0, viewDescription?: string): string {
  const parts: string[] = [item.name];
  
  if (item.designer?.name) {
    parts.push(`by ${item.designer.name}`);
  }
  
  if (item.category?.name) {
    parts.push(`- ${item.category.name}`);
  }
  
  if (viewDescription) {
    parts.push(`- ${viewDescription}`);
  } else if (imageIndex > 0) {
    parts.push(`- additional view`);
  }
  
  return parts.join(' ');
}

/**
 * Generate metadata for item page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) {
    return {
      title: 'Item Not Found | 606+',
    };
  }

  const title = generateTitle(item);
  const description = generateMetaDescription(item);
  const firstImage = item.images?.[0];
  const primaryImageUrl = firstImage ? buildLargeImageUrl(firstImage) : `${siteUrl}/606-Universal-Shelving-System.jpg`;
  const primaryImageAlt = firstImage?.alt || generateImageAlt(item, 0);

  return {
    title,
    description,
    openGraph: {
      title: `${item.name} | 606+`,
      description,
      url: `${siteUrl}/items/${slug}`,
      images: [
        {
          url: primaryImageUrl,
          width: 1200,
          height: 630,
          alt: primaryImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.name} | 606+`,
      description,
      images: [primaryImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/items/${slug}`,
    },
  };
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
    { href: '/my-606', label: 'My 606', active: false },
  ];

  const firstImage = item.images?.[0];
  const primaryImageUrl = firstImage ? buildLargeImageUrl(firstImage) : '';
  const primaryImageAlt = firstImage?.alt || generateImageAlt(item, 0);
  const additionalImages = item.images?.slice(1).map((img, index) => ({
    url: buildLargeImageUrl(img),
    alt: img.alt || generateImageAlt(item, index + 1),
  })).filter((img) => img.url) || [];
  const yearDisplay = formatYearRange(item.yearStart, item.yearEnd);

  // Fetch related items for internal linking
  const relatedItems = await getRelatedItems(
    item._id,
    item.designer?._id,
    item.category?._id,
    item.brand?._id,
    6
  );

  // Generate structured data
  const productSchema = generateProductSchema({
    name: item.name,
    description: item.description,
    image: primaryImageUrl,
    imageAlt: primaryImageAlt,
    url: `${siteUrl}/items/${slug}`,
    brand: item.brand?.name,
    designer: item.designer,
    category: item.category?.name,
    materials: item.materials,
    yearStart: item.yearStart,
    yearEnd: item.yearEnd,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Items', url: '/' },
    { name: item.name, url: `/items/${slug}` },
  ]);

  // Generate designer Person schema if available
  const designerSchema = item.designer?.name
    ? generatePersonSchema(item.designer.name, `${siteUrl}/items/${slug}`)
    : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {designerSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(designerSchema) }}
        />
      )}

      <Navigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="lg">
          <Container size="lg">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-neutral-600">
                <li>
                  <Link href="/" className="hover:text-neutral-900 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-neutral-400">/</li>
                <li>
                  <Link href="/" className="hover:text-neutral-900 transition-colors">
                    Items
                  </Link>
                </li>
                <li aria-hidden="true" className="text-neutral-400">/</li>
                <li className="text-neutral-900" aria-current="page">
                  {item.name}
                </li>
              </ol>
            </nav>

            {/* Asymmetric 2-column layout: 2/3 left, 1/3 right */}
            <article className="relative">
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
                        <BodyText size="sm">
                          <time dateTime={item.yearStart?.toString() || ''}>
                            {yearDisplay}
                          </time>
                        </BodyText>
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
            </article>

            {/* Related Items Section */}
            {relatedItems.length > 0 && (
              <Section spacing="lg" className="mt-16">
                <div className="mb-8">
                  <Heading level={2} className="mb-2">
                    Related Items
                  </Heading>
                  <BodyText size="sm" className="text-neutral-600">
                    Explore more design objects {item.designer?.name ? `by ${item.designer.name}` : ''} {item.category?.name ? `in ${item.category.name}` : ''}
                  </BodyText>
                </div>
                <nav aria-label="Related items">
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedItems.map((relatedItem) => (
                      <li key={relatedItem.slug}>
                        <Link
                          href={relatedItem.href}
                          className="block text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <BodyText size="sm">{relatedItem.name}</BodyText>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Section>
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

