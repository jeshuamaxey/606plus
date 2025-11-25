import { MetadataRoute } from 'next';
import { getAllItemSlugs } from '@/lib/sanity';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all item slugs from Sanity
  const items = await getAllItemSlugs();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic item pages
  const itemPages: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${siteUrl}/items/${item.slug}`,
    lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...itemPages];
}

