import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export interface HomepageItem {
  _id: string
  name: string
  slug: {
    current: string
  }
  number?: number
  category?: {
    name: string
  }
  designer?: {
    name: string
  }
  brand?: {
    name: string
  }
  yearStart?: number
  yearEnd?: number
  image?: {
    asset?: {
      _id: string
      _type: string
      url?: string
    }
  }
}

export interface TransformedItem {
  title: string
  subtitle?: string
  image: string
  imageAlt: string
  href: string
}

/**
 * Generate a slug from a name (fallback if slug doesn't exist)
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Build image URL from Sanity image reference
 */
function buildImageUrl(image: HomepageItem['image']): string {
  if (!image?.asset?._id) {
    return ''
  }
  // Use the asset reference to build the URL
  return builder.image(image).width(800).height(800).fit('crop').url()
}

/**
 * Format subtitle from category and year
 */
function formatSubtitle(item: HomepageItem): string {
  const parts: string[] = []
  
  if (item.category?.name) {
    parts.push(item.category.name)
  }
  
  if (item.yearStart) {
    parts.push(item.yearStart.toString())
  }
  
  return parts.join(' · ')
}

/**
 * Generate descriptive alt text for images
 */
function generateImageAlt(item: HomepageItem): string {
  const parts: string[] = [item.name]
  
  if (item.designer?.name) {
    parts.push(`by ${item.designer.name}`)
  }
  
  if (item.category?.name) {
    parts.push(`- ${item.category.name}`)
  }
  
  return parts.join(' ')
}

/**
 * Generate a slug from a name (fallback if slug doesn't exist)
 * Exported for use in other modules
 */
export function generateSlugFromName(name: string): string {
  return generateSlug(name);
}

/**
 * Fetch all published item slugs for sitemap generation
 */
export async function getAllItemSlugs(): Promise<Array<{ slug: string; _updatedAt: string }>> {
  try {
    const query = `*[_type == "item" && !(_id in path("drafts.**")) && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`;
    
    const items = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(query);
    return items || [];
  } catch (error) {
    console.error('Error fetching item slugs:', error);
    return [];
  }
}

/**
 * Fetch published items from Sanity CMS for homepage
 */
export async function getHomepageItems(): Promise<TransformedItem[]> {
  try {
    const query = `*[_type == "item" && !(_id in path("drafts.**"))] | order(number asc) {
      _id,
      name,
      slug,
      number,
      category->{name},
      designer->{name},
      brand->{name},
      yearStart,
      yearEnd,
      image {
        asset->{
          _id,
          _type
        }
      }
    }`
    
    const items = await client.fetch<HomepageItem[]>(query)
    
    return items
      .filter((item) => item.name) // Only include items with names
      .map((item) => {
        const slug = item.slug?.current || generateSlug(item.name)
        const imageUrl = buildImageUrl(item.image)
        
        return {
          title: item.name,
          subtitle: formatSubtitle(item),
          image: imageUrl,
          imageAlt: generateImageAlt(item),
          href: `/items/${slug}`,
        }
      })
      .filter((item) => item.image) // Only include items with images
  } catch (error) {
    console.error('Error fetching homepage items:', error)
    return []
  }
}

