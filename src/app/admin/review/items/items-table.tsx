'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {Item} from './page'
import {publishItem} from '../actions'

export function ItemsTable({items}: {items: Item[]}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Designer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Brand
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Year Start
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Year End
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {items.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-4 text-center text-zinc-500">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isDraft = item.isDraft || item._id.startsWith('drafts.')
              return (
                <tr key={item._id} className={isDraft ? 'bg-yellow-50' : ''}>
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                    {item.number ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900">{item.name ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {item.category?.name ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {item.designer?.name ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {item.brand?.name ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                    {item.yearStart ?? '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                    {item.yearEnd ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    <div className="max-w-xs truncate" title={item.description || undefined}>
                      {item.description ?? '-'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {isDraft ? (
                      <PublishButton itemId={item._id} />
                    ) : (
                      <span className="text-zinc-400">Published</span>
                    )}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function PublishButton({itemId}: {itemId: string}) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  
  async function handlePublish() {
    setIsPublishing(true)
    try {
      const result = await publishItem(itemId)
      
      if (result.success) {
        router.refresh()
      } else {
        alert(`Failed to publish: ${result.error}`)
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to publish'}`)
    } finally {
      setIsPublishing(false)
    }
  }
  
  return (
    <button
      onClick={handlePublish}
      disabled={isPublishing}
      className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
    >
      {isPublishing ? 'Publishing...' : 'Publish'}
    </button>
  )
}

