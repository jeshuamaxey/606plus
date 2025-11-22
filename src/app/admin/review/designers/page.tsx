import {createClient} from '@sanity/client'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
})

interface Designer {
  _id: string
  _type: string
  name?: string
  image?: {
    asset?: {
      _ref?: string
      url?: string
    }
  }
  isDraft?: boolean
}

async function getDesigners(): Promise<Designer[]> {
  try {
    const query = `*[_type == "designer"] | order(name asc) {
      _id,
      _type,
      name,
      image {
        asset->{
          _ref,
          url
        }
      }
    }`
    
    const designers = await client.fetch<Designer[]>(query)
    
    // Mark drafts based on _id pattern
    const processedDesigners = (designers || []).map((designer) => ({
      ...designer,
      isDraft: designer._id.startsWith('drafts.'),
    }))
    
    return processedDesigners
  } catch (error) {
    console.error('Error fetching designers:', error)
    return []
  }
}

export default async function DesignersReviewPage() {
  const designers = await getDesigners()
  
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
            <h1 className="text-3xl font-bold text-zinc-900">Admin Review - Designers</h1>
          </div>
          <Link
            href="/cms"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Open CMS
          </Link>
        </div>
        
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {designers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-zinc-500">
                    No designers found
                  </td>
                </tr>
              ) : (
                designers.map((designer) => {
                  const isDraft = designer.isDraft || designer._id.startsWith('drafts.')
                  return (
                    <tr key={designer._id} className={isDraft ? 'bg-yellow-50' : ''}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            isDraft
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isDraft ? 'Draft' : 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900">{designer.name ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {designer.image?.asset?.url ? (
                          <img
                            src={`${designer.image.asset.url}?w=48&h=48&fit=crop`}
                            alt={designer.name || 'Designer'}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

