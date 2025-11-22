import {createClient} from '@sanity/client'
import * as dotenv from 'dotenv'
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

// Valid schema types
const VALID_SCHEMA_TYPES = ['item', 'brand', 'designer', 'category'] as const
type SchemaType = typeof VALID_SCHEMA_TYPES[number]

async function deleteDocuments(schemaTypes: SchemaType[]) {
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
  
  // Create client with validated environment variables
  const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
  })
  
  console.log(`\n🗑️  Deleting documents of type(s): ${schemaTypes.join(', ')}`)
  console.log(`Dataset: ${dataset}`)
  console.log(`Project ID: ${projectId}\n`)
  
  // Process each schema type
  for (const schemaType of schemaTypes) {
    try {
      console.log(`\n📋 Processing ${schemaType} documents...`)
      
      // Fetch all documents of this type (both published and drafts)
      const query = `*[_type == $schemaType] {
        _id,
        _type
      }`
      
      const documents = await client.fetch<Array<{_id: string; _type: string}>>(
        query,
        {schemaType}
      ).catch(handle403Error)
      
      if (!documents || documents.length === 0) {
        console.log(`  ✓ No ${schemaType} documents found`)
        continue
      }
      
      console.log(`  Found ${documents.length} ${schemaType} document(s)`)
      
      // Delete each document
      let deleted = 0
      let errors = 0
      
      for (const doc of documents) {
        try {
          await client.delete(doc._id).catch(handle403Error)
          deleted++
          
          if (deleted % 10 === 0) {
            console.log(`  Deleted ${deleted}/${documents.length}...`)
          }
        } catch (error) {
          // handle403Error will exit if it's a 403, otherwise we log the error
          if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
            console.error(`  ✗ Error deleting ${doc._id}:`, error)
            errors++
          }
        }
      }
      
      console.log(`  ✓ Deleted ${deleted} ${schemaType} document(s)`)
      if (errors > 0) {
        console.log(`  ⚠ ${errors} error(s) occurred`)
      }
    } catch (error) {
      // handle403Error will exit if it's a 403, otherwise we log the error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode !== 403) {
        console.error(`Error processing ${schemaType}:`, error)
      }
    }
  }
  
  console.log(`\n✅ Deletion complete!`)
}

// Parse command line arguments
function parseArguments(): SchemaType[] {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Error: No schema types specified')
    console.error('\nUsage: npm run delete-cms -- item,brand,designer')
    console.error('\nValid schema types:', VALID_SCHEMA_TYPES.join(', '))
    console.error('\nExamples:')
    console.error('  npm run delete-cms -- item')
    console.error('  npm run delete-cms -- item,brand')
    console.error('  npm run delete-cms -- item,brand,designer,category')
    process.exit(1)
  }
  
  // Get the schema types from the first argument (comma-separated)
  const schemaTypesStr = args[0]
  const schemaTypes = schemaTypesStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0) as SchemaType[]
  
  // Validate schema types
  const invalidTypes = schemaTypes.filter(type => !VALID_SCHEMA_TYPES.includes(type))
  if (invalidTypes.length > 0) {
    console.error(`Error: Invalid schema type(s): ${invalidTypes.join(', ')}`)
    console.error(`Valid schema types: ${VALID_SCHEMA_TYPES.join(', ')}`)
    process.exit(1)
  }
  
  if (schemaTypes.length === 0) {
    console.error('Error: No valid schema types specified')
    process.exit(1)
  }
  
  return schemaTypes
}

// Main execution
async function main() {
  const schemaTypes = parseArguments()
  
  // Confirm deletion
  console.log('\n⚠️  WARNING: This will permanently delete all documents of the following types:')
  console.log(`   ${schemaTypes.join(', ')}`)
  console.log('\nThis action cannot be undone!')
  console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...')
  
  // Wait 5 seconds before proceeding
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  await deleteDocuments(schemaTypes)
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

