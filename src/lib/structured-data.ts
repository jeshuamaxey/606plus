/**
 * Structured Data (JSON-LD) helper functions for SEO
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

export interface Item {
  title: string;
  href: string;
  subtitle?: string;
}

export interface Organization {
  name: string;
  url: string;
  sameAs?: string[];
}

/**
 * Generate CollectionPage schema for collection/catalogue pages
 */
export function generateCollectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '606+ Design object catalogue',
    description: 'A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.',
    url: siteUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Timeless Design Objects',
    },
  };
}

/**
 * Generate ItemList schema for a list of items
 */
export function generateItemListSchema(items: Item[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Timeless Design Objects',
    description: 'A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.title,
        description: item.subtitle,
        url: `${siteUrl}${item.href}`,
      },
    })),
  };
}

/**
 * Generate Organization schema for site owner
 */
export function generateOrganizationSchema(org: Organization) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    ...(org.sameAs && { sameAs: org.sameAs }),
  };
}

/**
 * Generate Person schema (alternative to Organization)
 */
export function generatePersonSchema(name: string, url: string, email?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    ...(email && { email }),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '606+',
    url: siteUrl,
    description: 'A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.',
  };
}

