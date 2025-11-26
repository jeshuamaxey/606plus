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
    _id?: string
    name: string
    slug?: {
      current: string
    }
  }
  designer?: {
    _id?: string
    name: string
    slug?: {
      current: string
    }
  }
  brand?: {
    _id?: string
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
      "category": category->{
        _id,
        name,
        slug
      },
      "categoryRef": category._ref,
      "designer": designer->{
        _id,
        name,
        slug
      },
      "designerRef": designer._ref,
      "brand": brand->{
        _id,
        name,
        slug
      },
      "brandRef": brand._ref,
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
    
    const item = await client.fetch<any>(query, { slug })
    if (!item) return null
    
    // Map the reference IDs back to the category/designer/brand objects
    const mappedItem: ItemDetail = {
      _id: item._id,
      name: item.name,
      slug: item.slug,
      number: item.number,
      category: item.category ? { ...item.category, _id: item.categoryRef || item.category._id } : undefined,
      designer: item.designer ? { ...item.designer, _id: item.designerRef || item.designer._id } : undefined,
      brand: item.brand ? { ...item.brand, _id: item.brandRef || item.brand._id } : undefined,
      yearStart: item.yearStart,
      yearEnd: item.yearEnd,
      description: item.description,
      materials: item.materials,
      dimensions: item.dimensions,
      images: item.images,
    }
    
    return mappedItem
  } catch (error) {
    console.error('Error fetching item by slug:', error)
    return null
  }
}

/**
 * Fetch related items for internal linking
 * Returns items by same designer, category, or brand (excluding current item)
 */
export async function getRelatedItems(
  currentItemId: string,
  designerId?: string,
  categoryId?: string,
  brandId?: string,
  limit: number = 6
): Promise<Array<{ name: string; slug: string; href: string }>> {
  try {
    if (!designerId && !categoryId && !brandId) {
      return [];
    }

    const conditions: string[] = [
      '_type == "item"',
      '!(_id in path("drafts.**"))',
      `_id != $currentItemId`,
    ];

    const filters: string[] = [];
    if (designerId) {
      filters.push(`designer._ref == $designerId`);
    }
    if (categoryId) {
      filters.push(`category._ref == $categoryId`);
    }
    if (brandId) {
      filters.push(`brand._ref == $brandId`);
    }

    // Use OR logic to find items matching any of the criteria
    const filterClause = filters.length > 0 ? `&& (${filters.join(' || ')})` : '';

    const query = `*[${conditions.join(' && ')} ${filterClause}] | order(number asc) [0...${limit}] {
      _id,
      name,
      slug,
      category->{name},
      designer->{name},
      images[] {
        asset->{
          _id,
          _type
        },
        hotspot,
        crop,
        alt
      }
    }`;

    const params: any = { currentItemId };
    if (designerId) params.designerId = designerId;
    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;

    const items = await client.fetch<HomepageItem[]>(query, params);

    return (items || [])
      .filter((item) => item.name && item.slug?.current)
      .map((item) => ({
        name: item.name,
        slug: item.slug!.current,
        href: `/items/${item.slug!.current}`,
      }));
  } catch (error) {
    console.error('Error fetching related items:', error);
    return [];
  }
}

