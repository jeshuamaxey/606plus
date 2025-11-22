import {createClient} from '@sanity/client'
import Link from 'next/link'
import {ItemsTable} from './items-table'

export const dynamic = 'force-dynamic'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
})

export interface Item {
  _id: string
  _rev?: string
  _type: string
  number?: number
  name?: string
  category?: {
    _id: string
    _type: string
    name?: string
  }
  designer?: {
    _id: string
    _type: string
    name?: string
  }
  brand?: {
    _id: string
    _type: string
    name?: string
  }
  yearStart?: number
  yearEnd?: number
  description?: string
  isDraft?: boolean
}

async function getItems(): Promise<Item[]> {
  try {
    // Fetch all items - Sanity will return both published and drafts
    // We'll identify drafts by checking if _id starts with "drafts."
    const query = `*[_type == "item"] | order(number asc) {
      _id,
      _rev,
      _type,
      number,
      name,
      category->{_id, _type, name},
      designer->{_id, _type, name},
      brand->{_id, _type, name},
      yearStart,
      yearEnd,
      description
    }`
    
    const items = await client.fetch<Item[]>(query)
    
    // Mark drafts based on _id pattern
    const processedItems = (items || []).map((item) => ({
      ...item,
      isDraft: item._id.startsWith('drafts.'),
    }))
    
    return processedItems
  } catch (error) {
    console.error('Error fetching items:', error)
    return []
  }
}

export default async function ItemsReviewPage() {
  const items = await getItems()
  
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/review"
              className="text-sm text-zinc-600 hover:text-zinc-900 mb-2 inline-block"
            >
              ← Back to Review Index
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900">Admin Review - Items</h1>
          </div>
          <Link
            href="/cms"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Open CMS
          </Link>
        </div>
        
        <ItemsTable items={items} />
      </div>
    </div>
  )
}

