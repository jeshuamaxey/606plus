'use client'

import {useRouter} from 'next/navigation'
import {useState, useMemo} from 'react'
import {Item, isIncomplete} from './page'
import {publishItem, unpublishItem} from '../actions'

export function ItemsTable({items}: {items: Item[]}) {
  const [filterIncomplete, setFilterIncomplete] = useState(false)
  const router = useRouter()
  
  const filteredItems = useMemo(() => {
    if (!filterIncomplete) {
      return items
    }
    return items.filter(item => isIncomplete(item))
  }, [items, filterIncomplete])
  
  return (
    <div>
      <div className="mb-4 flex items-center gap-4 rounded-lg bg-white p-4 shadow">
        <button
          onClick={() => setFilterIncomplete(!filterIncomplete)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            filterIncomplete
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          {filterIncomplete ? '✓ Showing Incomplete Only' : 'Show Incomplete Items'}
        </button>
        {filterIncomplete && (
          <span className="text-sm text-zinc-600">
            Showing {filteredItems.length} of {items.length} items
          </span>
        )}
      </div>
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
              Incomplete
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
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-6 py-4 text-center text-zinc-500">
                No items found
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => {
              const isDraft = item.isDraft || item._id.startsWith('drafts.')
              const incomplete = isIncomplete(item)
              return (
                <tr 
                  key={item._id} 
                  className={`${isDraft ? 'bg-yellow-50' : ''} ${incomplete ? 'border-l-4 border-l-red-500' : ''}`}
                >
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
                  <td className="whitespace-nowrap px-6 py-4">
                    {incomplete ? (
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-red-100 text-red-800">
                        Incomplete
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">-</span>
                    )}
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
                    <div className="flex items-center gap-2">
                      {isDraft ? (
                        <PublishButton itemId={item._id} />
                      ) : (
                        <UnpublishButton itemId={item._id} />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
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

function UnpublishButton({itemId}: {itemId: string}) {
  const router = useRouter()
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  
  async function handleUnpublish() {
    if (!confirm('Are you sure you want to unpublish this item? It will be moved back to drafts.')) {
      return
    }
    
    setIsUnpublishing(true)
    try {
      const result = await unpublishItem(itemId)
      
      if (result.success) {
        router.refresh()
      } else {
        alert(`Failed to unpublish: ${result.error}`)
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to unpublish'}`)
    } finally {
      setIsUnpublishing(false)
    }
  }
  
  return (
    <button
      onClick={handleUnpublish}
      disabled={isUnpublishing}
      className="rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
    >
      {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
    </button>
  )
}

