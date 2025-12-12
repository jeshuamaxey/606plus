'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { ShelfItem } from '@/lib/sanity'
import { buildImageUrl } from '@/lib/sanity'
import { BodyText, Label } from '@/components/ui/Typography'

interface ItemPickerProps {
  items: ShelfItem[]
  onItemSelect?: (itemId: string) => void
}

export function ItemPicker({ items, onItemSelect }: ItemPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDesigner, setSelectedDesigner] = useState<string>('')

  // Extract unique categories and designers for filters
  const categories = useMemo(() => {
    const cats = new Set<string>()
    items.forEach((item) => {
      if (item.category?.name) {
        cats.add(item.category.name)
      }
    })
    return Array.from(cats).sort()
  }, [items])

  const designers = useMemo(() => {
    const des = new Set<string>()
    items.forEach((item) => {
      if (item.designer?.name) {
        des.add(item.designer.name)
      }
    })
    return Array.from(des).sort()
  }, [items])

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesDesigner = item.designer?.name.toLowerCase().includes(query) || false
        const matchesBrand = item.brand?.name.toLowerCase().includes(query) || false
        const matchesCategory = item.category?.name.toLowerCase().includes(query) || false
        if (!matchesName && !matchesDesigner && !matchesBrand && !matchesCategory) {
          return false
        }
      }

      // Category filter
      if (selectedCategory && item.category?.name !== selectedCategory) {
        return false
      }

      // Designer filter
      if (selectedDesigner && item.designer?.name !== selectedDesigner) {
        return false
      }

      return true
    })
  }, [items, searchQuery, selectedCategory, selectedDesigner])

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleItemClick = (itemId: string) => {
    onItemSelect?.(itemId)
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-neutral-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-medium mb-4">Items</h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div>
            <Label className="text-xs mb-1 block">Category</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Designer</Label>
            <select
              value={selectedDesigner}
              onChange={(e) => setSelectedDesigner(e.target.value)}
              className="w-full px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="">All designers</option>
              {designers.map((des) => (
                <option key={des} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4">
          <BodyText size="sm" className="text-neutral-600 text-xs">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </BodyText>
        </div>
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const firstImage = item.images?.[0]
            const imageUrl = firstImage ? buildImageUrl(firstImage) : ''
            const imageAlt = firstImage?.alt || item.name

            return (
              <div
                key={item._id}
                draggable
                onDragStart={(e) => handleDragStart(e, item._id)}
                onClick={() => handleItemClick(item._id)}
                className="cursor-move hover:opacity-80 transition-opacity group"
                title={item.name}
              >
                {imageUrl ? (
                  <div className="relative aspect-square bg-neutral-100 rounded overflow-hidden mb-2">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-neutral-100 rounded mb-2 flex items-center justify-center">
                    <BodyText size="sm" className="text-neutral-400 text-xs">
                      No image
                    </BodyText>
                  </div>
                )}
                <div className="space-y-1">
                  <BodyText size="sm" className="font-medium line-clamp-1">
                    {item.name}
                  </BodyText>
                  {item.designer?.name && (
                    <BodyText size="sm" className="text-neutral-600 line-clamp-1 text-xs">
                      {item.designer.name}
                    </BodyText>
                  )}
                  {item.category?.name && (
                    <BodyText size="sm" className="text-neutral-500 uppercase tracking-wide text-[10px]">
                      {item.category.name}
                    </BodyText>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <BodyText size="sm" className="text-neutral-500">
              No items found
            </BodyText>
          </div>
        )}
      </div>
    </div>
  )
}

