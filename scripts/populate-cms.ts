import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({path: path.join(process.cwd(), '.env.local')})

// Helper function to check for 403 errors and exit immediately
function handle403Error(error: any): never {
  // Check various possible locations for status code
  const statusCode = 
    error?.statusCode || 
    error?.response?.statusCode || 
    error?.status ||
    error?.response?.status ||
    (error?.message?.includes('403') ? 403 : null) ||
    (error?.message?.toLowerCase().includes('forbidden') ? 403 : null)
  
  if (statusCode === 403) {
    console.error('\n❌ Error: 403 Forbidden')
    console.error('Your API token does not have permission to perform this operation.')
    console.error('Please check:')
    console.error('  1. Your SANITY_API_TOKEN is correct')
    console.error('  2. The token has "Editor" permissions')
    console.error('  3. The token is for the correct project')
    console.error('\nGet your API token from: https://www.sanity.io/manage')
    process.exit(1)
  }
  throw error
}

interface CatalogueItem {
  number: number
  name: string
  category: string
  designerMaker: string
  year: string
  notes: string
}

// Parse markdown table
function parseMarkdownTable(filePath: string): CatalogueItem[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  // Find the table start (skip header and separator)
  const tableStartIndex = lines.findIndex(line => line.trim().startsWith('| #'))
  if (tableStartIndex === -1) {
    throw new Error('Table not found in markdown file')
  }
  
  const items: CatalogueItem[] = []
  
  for (let i = tableStartIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('|') || line.startsWith('|---')) continue
    
    const cells = line.split('|').map(c => c.trim()).filter(c => c)
    if (cells.length < 6) continue
    
    const number = parseInt(cells[0], 10)
    if (isNaN(number)) continue
    
    items.push({
      number,
      name: cells[1],
      category: cells[2],
      designerMaker: cells[3],
      year: cells[4],
      notes: cells[5],
    })
  }
  
  return items
}

// Extract unique categories
function extractCategories(items: CatalogueItem[]): string[] {
  const categories = new Set<string>()
  items.forEach(item => {
    // Handle categories that might have slashes (e.g., "Book/Publication")
    const categoryParts = item.category.split('/')
    categoryParts.forEach(part => {
      const trimmed = part.trim()
      if (trimmed) categories.add(trimmed)
    })
  })
  return Array.from(categories).sort()
}

// Extract unique designers
function extractDesigners(items: CatalogueItem[]): string[] {
  const designers = new Set<string>()
  items.forEach(item => {
    if (item.designerMaker && item.designerMaker.trim() && item.designerMaker !== '-') {
      // Handle multiple designers separated by "/" or "&"
      const designerParts = item.designerMaker
        .split(/[&/]/)
        .map(d => d.trim())
        .filter(d => d && d !== '-')
      
      designerParts.forEach(designer => {
        // Remove common suffixes like "for Brand"
        const cleanDesigner = designer
          .replace(/\s+for\s+.*$/i, '')
          .replace(/\s+\(.*\)$/, '')
          .trim()
        if (cleanDesigner) designers.add(cleanDesigner)
      })
    }
  })
  return Array.from(designers).sort()
}

// Extract unique brands
function extractBrands(items: CatalogueItem[]): string[] {
  const brands = new Set<string>()
  items.forEach(item => {
    if (item.designerMaker && item.designerMaker.includes('for ')) {
      const match = item.designerMaker.match(/for\s+([^,]+)/i)
      if (match) {
        const brand = match[1].trim()
        if (brand && brand !== '-') brands.add(brand)
      }
    }
    // Also check the name field for brand mentions
    if (item.name) {
      // Common brand patterns in names
      const brandPatterns = [
        /^(Braun|Leica|Rotring|Lamy|Wüsthof|Starrett|Muji|Alessi|Vitra|Junghans|Olivetti|IBM|Ericsson|Polaroid|Filofax|Moleskin|Faber-Castell|Marimekko|Kvadrat|Pyrex|Duran)/i,
      ]
      brandPatterns.forEach(pattern => {
        const match = item.name.match(pattern)
        if (match) brands.add(match[1])
      })
    }
  })
  return Array.from(brands).sort()
}

// Parse year string to start and end
function parseYear(yearStr: string): {yearStart?: number; yearEnd?: number} {
  if (!yearStr || yearStr === '-' || yearStr.trim() === '' || 
      yearStr.toLowerCase().includes('various') ||
      yearStr.toLowerCase().includes('vintage') ||
      yearStr.toLowerCase().includes('antique') ||
      yearStr.toLowerCase().includes('traditional') ||
      yearStr.toLowerCase().includes('contemporary')) {
    return {}
  }
  
  // Handle ranges like "1968-1998" or "1956-57" or "1951-present"
  const rangeMatch = yearStr.match(/(\d{4})\s*-\s*(\d{2,4}|present)/i)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10)
    const endStr = rangeMatch[2].toLowerCase()
    
    if (endStr === 'present') {
      return {yearStart: start}
    }
    
    let end = parseInt(endStr, 10)
    // If end is 2 digits and start is 4 digits, assume same century
    if (end < 100 && start >= 1900) {
      const century = Math.floor(start / 100) * 100
      end = century + end
    }
    return {yearStart: start, yearEnd: end}
  }
  
  // Handle "Pre-2000" or "Pre-ubiquity" patterns
  const preMatch = yearStr.match(/pre[-\s]+(\d{4})/i)
  if (preMatch) {
    const year = parseInt(preMatch[1], 10)
    return {yearEnd: year - 1}
  }
  
  // Handle single year
  const singleYearMatch = yearStr.match(/(\d{4})/)
  if (singleYearMatch) {
    const year = parseInt(singleYearMatch[1], 10)
    return {yearStart: year}
  }
  
  return {}
}

// Main population function
async function populateCMS() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN
  
  if (!projectId) {
    console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required')
    console.error('Please create a .env.local file with:')
    console.error('  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here')
    console.error('  NEXT_PUBLIC_SANITY_DATASET=production')
    console.error('  SANITY_API_TOKEN=your_api_token_here')
    process.exit(1)
  }
  
  if (!token) {
    console.error('Error: SANITY_API_TOKEN environment variable is required')
    console.error('Get your API token from https://www.sanity.io/manage')
    console.error('(Go to your project → API → Tokens → Add API token with Editor permissions)')
    process.exit(1)
  }
  
  // Recreate client with validated environment variables
  const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
  })
  
  const markdownPath = path.join(process.cwd(), 'vitsoe_catalogue.md')
  const items = parseMarkdownTable(markdownPath)
  
  console.log(`Parsed ${items.length} items from markdown file`)
  
  // Create categories
  const categories = extractCategories(items)
  console.log(`Found ${categories.length} unique categories`)
  
  const categoryMap = new Map<string, string>()
  for (const categoryName of categories) {
    try {
      // Check if category already exists
      const existing = await client.fetch(
        `*[_type == "category" && name == $name][0]`,
        {name: categoryName}
      ).catch(handle403Error)
      
      if (existing) {
        console.log(`Category "${categoryName}" already exists`)
        categoryMap.set(categoryName, existing._id)
      } else {
        const category = await client.create({
          _type: 'category',
          name: categoryName,
          slug: {
            _type: 'slug',
            current: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          },
        }).catch(handle403Error)
        console.log(`Created category: ${categoryName}`)
        categoryMap.set(categoryName, category._id)
      }
    } catch (error) {
      // handle403Error will exit if it's a 403, otherwise we log the error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
        console.error(`Error creating category "${categoryName}":`, error)
      }
    }
  }
  
  // Create designers
  const designers = extractDesigners(items)
  console.log(`Found ${designers.length} unique designers`)
  
  const designerMap = new Map<string, string>()
  for (const designerName of designers) {
    try {
      const existing = await client.fetch(
        `*[_type == "designer" && name == $name][0]`,
        {name: designerName}
      ).catch(handle403Error)
      
      if (existing) {
        console.log(`Designer "${designerName}" already exists`)
        designerMap.set(designerName, existing._id)
      } else {
        const designer = await client.create({
          _type: 'designer',
          name: designerName,
        }).catch(handle403Error)
        console.log(`Created designer: ${designerName}`)
        designerMap.set(designerName, designer._id)
      }
    } catch (error) {
      // handle403Error will exit if it's a 403, otherwise we log the error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
        console.error(`Error creating designer "${designerName}":`, error)
      }
    }
  }
  
  // Create brands
  const brands = extractBrands(items)
  console.log(`Found ${brands.length} unique brands`)
  
  const brandMap = new Map<string, string>()
  for (const brandName of brands) {
    try {
      const existing = await client.fetch(
        `*[_type == "brand" && name == $name][0]`,
        {name: brandName}
      ).catch(handle403Error)
      
      if (existing) {
        console.log(`Brand "${brandName}" already exists`)
        brandMap.set(brandName, existing._id)
      } else {
        const brand = await client.create({
          _type: 'brand',
          name: brandName,
        }).catch(handle403Error)
        console.log(`Created brand: ${brandName}`)
        brandMap.set(brandName, brand._id)
      }
    } catch (error) {
      // handle403Error will exit if it's a 403, otherwise we log the error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
        console.error(`Error creating brand "${brandName}":`, error)
      }
    }
  }
  
  // Create items as drafts
  console.log(`Creating ${items.length} items as drafts...`)
  let created = 0
  let skipped = 0
  
  for (const item of items) {
    try {
      // Check if item already exists (check both published and drafts)
      const draftId = `drafts.item-${item.number}`
      const [existingPublished, existingDraft] = await Promise.all([
        // Check for published items with this number
        client.fetch(
          `*[_type == "item" && number == $number][0]`,
          {number: item.number}
        ).catch(handle403Error),
        // Check for existing draft with this ID
        client.fetch(
          `*[_id == $draftId][0]`,
          {draftId}
        ).catch(handle403Error),
      ])
      
      // Skip if published item exists, or if draft exists (unless published item also exists)
      if (existingPublished) {
        console.log(`Item #${item.number} already exists as published, skipping`)
        skipped++
        continue
      }
      
      if (existingDraft) {
        console.log(`Item #${item.number} already exists as draft, skipping`)
        skipped++
        continue
      }
      
      // Find category - use first part if it's a compound category
      const categoryName = item.category.split('/')[0].trim()
      const categoryId = categoryMap.get(categoryName)
      if (!categoryId) {
        console.warn(`Category "${categoryName}" not found for item #${item.number}`)
        continue
      }
      
      // Find designer
      let designerId: string | undefined
      if (item.designerMaker && item.designerMaker !== '-') {
        const designerName = item.designerMaker
          .split(/[&/]/)[0]
          .replace(/\s+for\s+.*$/i, '')
          .replace(/\s+\(.*\)$/, '')
          .trim()
        designerId = designerMap.get(designerName)
      }
      
      // Find brand
      let brandId: string | undefined
      if (item.designerMaker && item.designerMaker.includes('for ')) {
        const match = item.designerMaker.match(/for\s+([^,]+)/i)
        if (match) {
          const brandName = match[1].trim()
          brandId = brandMap.get(brandName)
        }
      }
      
      // Parse year
      const {yearStart, yearEnd} = parseYear(item.year)
      
      // Create item as draft (prefixed with "drafts.")
      // Use the draftId already defined above
      await client.create({
        _id: draftId,
        _type: 'item',
        number: item.number,
        name: item.name,
        category: {
          _type: 'reference',
          _ref: categoryId,
        },
        ...(designerId && {
          designer: {
            _type: 'reference',
            _ref: designerId,
          },
        }),
        ...(brandId && {
          brand: {
            _type: 'reference',
            _ref: brandId,
          },
        }),
        ...(yearStart && {yearStart}),
        ...(yearEnd && {yearEnd}),
        description: item.notes || '',
      }).catch(handle403Error)
      
      created++
      if (created % 10 === 0) {
        console.log(`Created ${created} items...`)
      }
    } catch (error) {
      // handle403Error will exit if it's a 403, otherwise we log the error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
        console.error(`Error creating item #${item.number}:`, error)
      }
    }
  }
  
  console.log(`\nDone! Created ${created} items as drafts, skipped ${skipped} existing items`)
  console.log(`Note: Items are created as drafts. Use the /admin/review page to publish them.`)
}

// Run the script
populateCMS().catch(console.error)

