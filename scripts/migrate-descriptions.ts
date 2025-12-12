import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({path: path.join(process.cwd(), '.env.local')})

// Helper function to check for 403 errors and exit immediately
function handle403Error(error: any): never {
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

/**
 * Convert plain text to Portable Text blocks
 * Splits on double newlines (\n\n) to create separate paragraphs
 */
function textToPortableText(text: string): Array<{
  _type: 'block'
  _key: string
  style: 'normal'
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks: string[]
  }>
}> {
  if (!text || typeof text !== 'string') {
    return []
  }

  // Split on double newlines to create paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)
  
  if (paragraphs.length === 0) {
    return []
  }

  return paragraphs.map((paragraph, index) => {
    // Clean up the paragraph text (remove single newlines, trim)
    const cleanText = paragraph.replace(/\n/g, ' ').trim()
    
    return {
      _type: 'block' as const,
      _key: `block-${index}-${Date.now()}`,
      style: 'normal' as const,
      children: [
        {
          _type: 'span' as const,
          _key: `span-${index}-${Date.now()}`,
          text: cleanText,
          marks: [],
        },
      ],
    }
  })
}

/**
 * Check if a description is already in Portable Text format (array of blocks)
 */
function isPortableText(description: any): boolean {
  return Array.isArray(description) && 
         description.length > 0 && 
         description[0]?._type === 'block'
}

/**
 * Migrate all item descriptions from plain text to Portable Text
 */
async function migrateDescriptions() {
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
  
  const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
  })

  console.log('Fetching all items (published and drafts)...\n')

  try {
    // Fetch ALL items (both published and drafts) - we'll filter in code
    // This ensures we don't miss any items due to GROQ query limitations
    const query = `*[_type == "item"] {
      _id,
      _rev,
      name,
      number,
      description
    }`

    const allItems = await client.fetch<any[]>(query).catch(handle403Error)
    
    if (!allItems || allItems.length === 0) {
      console.log('No items found.')
      return
    }

    console.log(`Found ${allItems.length} total items\n`)

    // Filter to only items that have a description field (even if null/empty)
    // and that are strings (not already converted to Portable Text)
    const items = allItems.filter((item) => {
      // Include if description exists and is a string
      return item.description !== undefined && typeof item.description === 'string'
    })

    if (items.length === 0) {
      console.log('No items with string descriptions found.')
      console.log(`\nItems found but skipped:`)
      allItems.forEach((item) => {
        const descType = item.description === undefined 
          ? 'undefined' 
          : Array.isArray(item.description) 
            ? 'array (already Portable Text)' 
            : typeof item.description
        console.log(`  - Item #${item.number || '?'} "${item.name}" - description type: ${descType}`)
      })
      return
    }

    console.log(`Found ${items.length} items with string descriptions to migrate\n`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const item of items) {
      try {
        // Skip if already in Portable Text format
        if (isPortableText(item.description)) {
          console.log(`✓ Item #${item.number || '?'} "${item.name}" - already in Portable Text format, skipping`)
          skipped++
          continue
        }

        // Skip if description is not a string
        if (typeof item.description !== 'string') {
          console.log(`⚠ Item #${item.number || '?'} "${item.name}" - description is not a string (type: ${typeof item.description}), skipping`)
          skipped++
          continue
        }

        // Skip if description is empty or whitespace only
        if (!item.description || item.description.trim().length === 0) {
          console.log(`⚠ Item #${item.number || '?'} "${item.name}" - description is empty, skipping`)
          skipped++
          continue
        }

        // Convert to Portable Text
        const portableText = textToPortableText(item.description)

        if (portableText.length === 0) {
          console.log(`⚠ Item #${item.number || '?'} "${item.name}" - empty description after conversion, skipping`)
          skipped++
          continue
        }

        // Update the item
        await client
          .patch(item._id)
          .set({description: portableText})
          .commit()
          .catch(handle403Error)

        console.log(`✓ Item #${item.number || '?'} "${item.name}" - migrated (${portableText.length} paragraph${portableText.length !== 1 ? 's' : ''})`)
        migrated++

      } catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
          console.error(`✗ Error migrating item #${item.number || '?'} "${item.name}":`, error)
          errors++
        }
      }
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   Migrated: ${migrated} items`)
    console.log(`   Skipped: ${skipped} items`)
    if (errors > 0) {
      console.log(`   Errors: ${errors} items`)
    }

  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
      console.error('Error fetching items:', error)
      process.exit(1)
    }
  }
}

// Run the migration
migrateDescriptions().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

