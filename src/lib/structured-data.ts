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

/**
 * Generate Product schema for individual item pages
 */
export interface ProductItem {
  name: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url: string;
  brand?: string;
  designer?: {
    name: string;
  };
  category?: string;
  materials?: string;
  yearStart?: number;
  yearEnd?: number;
}

export function generateProductSchema(item: ProductItem) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    url: item.url,
  };

  if (item.description) {
    schema.description = item.description;
  }

  if (item.image) {
    schema.image = {
      '@type': 'ImageObject',
      url: item.image,
      ...(item.imageAlt && { contentUrl: item.image, encodingFormat: 'image/jpeg' }),
    };
  }

  if (item.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: item.brand,
    };
  }

  if (item.designer) {
    schema.manufacturer = {
      '@type': 'Person',
      name: item.designer.name,
    };
  }

  if (item.category) {
    schema.category = item.category;
  }

  if (item.materials) {
    schema.material = item.materials;
  }

  if (item.yearStart) {
    const productionDate = item.yearEnd && item.yearEnd !== item.yearStart
      ? `${item.yearStart}-${item.yearEnd}`
      : item.yearStart.toString();
    schema.productionDate = productionDate;
  }

  return schema;
}

