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
  images?: Array<{
    asset?: {
      _id: string
      _type: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
    alt?: string
    credit?: string
  }>
}

export interface TransformedItem {
  title: string
  subtitle?: string
  image: string
  imageAlt: string
  href: string
}

export interface ItemDetail {
  _id: string
  name: string
  slug: {
    current: string
  }
  number?: number
  category?: {
    name: string
    slug?: {
      current: string
    }
  }
  designer?: {
    name: string
    slug?: {
      current: string
    }
  }
  brand?: {
    name: string
    slug?: {
      current: string
    }
  }
  yearStart?: number
  yearEnd?: number
  description?: string
  materials?: string
  dimensions?: string
  images?: Array<{
    asset?: {
      _id: string
      _type: string
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
    alt?: string
    credit?: string
  }>
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
 * Build image URL from Sanity image reference with hotspot support
 */
function buildImageUrl(image: ImageReference | null | undefined): string {
  if (!image?.asset?._id) {
    return ''
  }
  
  // Sanity's image URL builder automatically uses hotspot if present in the image object
  // This ensures intelligent cropping that keeps the focal point visible
  return builder.image(image).width(800).height(800).fit('crop').url()
}

/**
 * Build image URL for larger display (item detail page) with hotspot support
 */
type ImageReference = {
  asset?: {
    _id: string
    _type: string
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export function buildLargeImageUrl(image: ImageReference | null | undefined): string {
  if (!image?.asset?._id) {
    return ''
  }
  
  // Sanity's image URL builder automatically uses hotspot if present in the image object
  // This ensures intelligent cropping that keeps the focal point visible
  return builder.image(image).width(1200).height(1200).fit('crop').url()
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
      images[] {
        asset->{
          _id,
          _type
        },
        hotspot,
        crop,
        alt,
        credit
      }
    }`
    
    const items = await client.fetch<HomepageItem[]>(query)
    
    return items
      .filter((item) => item.name) // Only include items with names
      .map((item) => {
        const slug = item.slug?.current || generateSlug(item.name)
        const firstImage = item.images?.[0]
        const imageUrl = firstImage ? buildImageUrl(firstImage) : ''
        
        return {
          title: item.name,
          subtitle: formatSubtitle(item),
          image: imageUrl,
          imageAlt: firstImage?.alt || item.name,
          href: `/items/${slug}`,
        }
      })
      .filter((item) => item.image) // Only include items with images
  } catch (error) {
    console.error('Error fetching homepage items:', error)
    return []
  }
}

/**
 * Fetch a single item by slug from Sanity CMS
 */
export async function getItemBySlug(slug: string): Promise<ItemDetail | null> {
  try {
    const query = `*[_type == "item" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      name,
      slug,
      number,
      category->{
        name,
        slug
      },
      designer->{
        name,
        slug
      },
      brand->{
        name,
        slug
      },
      yearStart,
      yearEnd,
      description,
      materials,
      dimensions,
      images[] {
        asset->{
          _id,
          _type
        },
        hotspot,
        crop,
        alt,
        credit
      }
    }`
    
    const item = await client.fetch<ItemDetail | null>(query, { slug })
    return item || null
  } catch (error) {
    console.error('Error fetching item by slug:', error)
    return null
  }
}

