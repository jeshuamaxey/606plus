'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ShelfItem as ShelfStateItem, ShelfState } from '@/lib/shelf-storage'
import { saveShelfState, loadShelfState } from '@/lib/shelf-storage'
import type { ShelfItem } from '@/lib/sanity'
import { buildImageUrl } from '@/lib/sanity'

interface ShelfCanvasProps {
  items: ShelfItem[]
  onItemSelect?: (itemId: string) => void
}

interface PlacedItem extends ShelfStateItem {
  imageUrl?: string
  imageLoaded?: boolean
}

// Shelf configuration matching Vitsoe 606 layout
// Left column (narrow): 2 shelves, 2 drawers, 1 shelf
// Right column (wide): 2 shelves, 3 drawers
const SHELF_CONFIG = {
  narrow: {
    width: 0.35, // 35% of total width
    shelves: [
      { y: 0.1, height: 0.15 }, // Top shelf
      { y: 0.25, height: 0.15 }, // Second shelf
      { y: 0.75, height: 0.15 }, // Bottom shelf
    ],
    drawers: [
      { y: 0.45, height: 0.12 }, // Top drawer pair
      { y: 0.57, height: 0.12 }, // Bottom drawer pair
    ],
  },
  wide: {
    width: 0.65, // 65% of total width
    x: 0.35, // Starts at 35%
    shelves: [
      { y: 0.1, height: 0.15 }, // Top shelf
      { y: 0.25, height: 0.15 }, // Second shelf
    ],
    drawers: [
      { y: 0.45, height: 0.12 }, // Top drawer
      { y: 0.57, height: 0.12 }, // Middle drawer
      { y: 0.69, height: 0.12 }, // Bottom drawer
    ],
  },
}

const DEFAULT_DIMENSIONS = {
  width: 100, // mm
  height: 100, // mm
  depth: 100, // mm
}

// Scale factor: 1mm = X pixels on canvas
const MM_TO_PX = 2 // Adjust based on canvas size

export function ShelfCanvas({ items, onItemSelect }: ShelfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shelfState, setShelfState] = useState<ShelfState>({ items: [] })
  const [draggedItem, setDraggedItem] = useState<PlacedItem | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = loadShelfState()
    if (saved) {
      setShelfState(saved)
    }
  }, [])

  // Load images for placed items
  useEffect(() => {
    const imageMap = new Map<string, HTMLImageElement>()
    const loadPromises: Promise<void>[] = []

    shelfState.items.forEach((placedItem) => {
      const item = items.find((i) => i._id === placedItem.itemId)
      if (!item || !item.images?.[0]) return

      const imageUrl = buildImageUrl(item.images[0])
      if (!imageUrl) return

      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          imageMap.set(placedItem.itemId, img)
          resolve()
        }
        img.onerror = reject
        img.src = imageUrl
      })
      
      loadPromises.push(promise)
    })

    Promise.all(loadPromises).then(() => {
      setLoadedImages(imageMap)
    })
  }, [shelfState.items, items])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (shelfState.items.length > 0 || loadShelfState()) {
      saveShelfState(shelfState)
    }
  }, [shelfState])

  // Draw shelf structure
  const drawShelves = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.fillStyle = '#fff'

    // Draw left column (narrow)
    const narrow = SHELF_CONFIG.narrow
    const narrowX = 0
    const narrowWidth = width * narrow.width

    // Vertical dividers
    ctx.beginPath()
    ctx.moveTo(narrowWidth, 0)
    ctx.lineTo(narrowWidth, height)
    ctx.stroke()

    // Shelves in narrow column
    narrow.shelves.forEach((shelf) => {
      ctx.beginPath()
      ctx.moveTo(narrowX, height * shelf.y)
      ctx.lineTo(narrowWidth, height * shelf.y)
      ctx.moveTo(narrowX, height * (shelf.y + shelf.height))
      ctx.lineTo(narrowWidth, height * (shelf.y + shelf.height))
      ctx.stroke()
    })

    // Drawers in narrow column (shown as rectangles)
    narrow.drawers.forEach((drawer) => {
      ctx.strokeRect(narrowX, height * drawer.y, narrowWidth, height * drawer.height)
    })

    // Draw right column (wide)
    const wide = SHELF_CONFIG.wide
    const wideX = width * (wide.x || 0)
    const wideWidth = width * wide.width

    // Shelves in wide column
    wide.shelves.forEach((shelf) => {
      ctx.beginPath()
      ctx.moveTo(wideX, height * shelf.y)
      ctx.lineTo(width, height * shelf.y)
      ctx.moveTo(wideX, height * (shelf.y + shelf.height))
      ctx.lineTo(width, height * (shelf.y + shelf.height))
      ctx.stroke()
    })

    // Drawers in wide column
    wide.drawers.forEach((drawer) => {
      ctx.strokeRect(wideX, height * drawer.y, wideWidth, height * drawer.height)
    })
  }, [])

  // Get shelf bounds for a given position
  const getShelfBounds = useCallback((column: 'narrow' | 'wide', shelfIndex: number) => {
    const config = SHELF_CONFIG[column]
    const shelves = [...config.shelves, ...config.drawers].sort((a, b) => a.y - b.y)
    const shelf = shelves[shelfIndex]
    if (!shelf) return null

    const x = column === 'narrow' ? 0 : ('x' in config ? config.x : 0)

    return {
      y: shelf.y,
      height: shelf.height,
      x,
      width: config.width,
    }
  }, [])

  // Draw items on shelves
  const drawItems = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      shelfState.items.forEach((placedItem) => {
        const item = items.find((i) => i._id === placedItem.itemId)
        if (!item) return

        const bounds = getShelfBounds(placedItem.column, placedItem.shelfIndex)
        if (!bounds) return

        const displayWidth = item.displayWidth || DEFAULT_DIMENSIONS.width
        const displayHeight = item.displayHeight || DEFAULT_DIMENSIONS.height

        // Scale dimensions to canvas
        const itemWidth = (displayWidth * MM_TO_PX * width) / 1000
        const itemHeight = (displayHeight * MM_TO_PX * width) / 1000

        // Calculate position
        const shelfX = bounds.x * width
        const shelfY = bounds.y * height
        const shelfWidth = bounds.width * width
        const shelfHeight = bounds.height * height

        const x = shelfX + placedItem.x * shelfWidth - itemWidth / 2
        const y = shelfY + placedItem.y * shelfHeight - itemHeight

        // Draw item image
        const img = loadedImages.get(placedItem.itemId)
        if (img) {
          ctx.save()
          if (placedItem.rotation) {
            ctx.translate(x + itemWidth / 2, y + itemHeight / 2)
            ctx.rotate((placedItem.rotation * Math.PI) / 180)
            ctx.translate(-(x + itemWidth / 2), -(y + itemHeight / 2))
          }
          ctx.drawImage(img, x, y, itemWidth, itemHeight)
          ctx.restore()
        } else {
          // Fallback: draw rectangle
          ctx.fillStyle = '#e5e5e5'
          ctx.fillRect(x, y, itemWidth, itemHeight)
          ctx.strokeStyle = '#999'
          ctx.strokeRect(x, y, itemWidth, itemHeight)
        }

        // Draw selection indicator
        if (draggedItem?.itemId === placedItem.itemId) {
          ctx.strokeStyle = '#000'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(x - 2, y - 2, itemWidth + 4, itemHeight + 4)
          ctx.setLineDash([])
        }
      })
    },
    [shelfState.items, items, loadedImages, draggedItem, getShelfBounds]
  )

  // Main draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const width = rect.width
    const height = rect.height

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)

    // Draw shelves
    drawShelves(ctx, width, height)

    // Draw items
    drawItems(ctx, width, height)
  }, [drawShelves, drawItems])

  // Redraw on changes
  useEffect(() => {
    draw()
  }, [draw, shelfState, loadedImages, draggedItem])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      draw()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  // Get shelf info from canvas coordinates
  const getShelfFromPoint = useCallback(
    (x: number, y: number, canvasWidth: number, canvasHeight: number) => {
      const narrowWidth = canvasWidth * SHELF_CONFIG.narrow.width

      if (x < narrowWidth) {
        // Narrow column
        const shelves = [...SHELF_CONFIG.narrow.shelves, ...SHELF_CONFIG.narrow.drawers].sort(
          (a, b) => a.y - b.y
        )
        for (let i = 0; i < shelves.length; i++) {
          const shelf = shelves[i]
          const shelfY = shelf.y * canvasHeight
          const shelfHeight = shelf.height * canvasHeight
          if (y >= shelfY && y <= shelfY + shelfHeight) {
            return {
              column: 'narrow' as const,
              shelfIndex: i,
              relativeX: x / narrowWidth,
              relativeY: (y - shelfY) / shelfHeight,
            }
          }
        }
      } else {
        // Wide column
        const shelves = [...SHELF_CONFIG.wide.shelves, ...SHELF_CONFIG.wide.drawers].sort(
          (a, b) => a.y - b.y
        )
        const wideX = canvasWidth * (SHELF_CONFIG.wide.x || 0)
        const wideWidth = canvasWidth * SHELF_CONFIG.wide.width
        const relativeX = (x - wideX) / wideWidth

        for (let i = 0; i < shelves.length; i++) {
          const shelf = shelves[i]
          const shelfY = shelf.y * canvasHeight
          const shelfHeight = shelf.height * canvasHeight
          if (y >= shelfY && y <= shelfY + shelfHeight) {
            return {
              column: 'wide' as const,
              shelfIndex: i,
              relativeX,
              relativeY: (y - shelfY) / shelfHeight,
            }
          }
        }
      }
      return null
    },
    []
  )

  // Handle canvas click/drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if clicking on an item
      for (const placedItem of shelfState.items) {
        const item = items.find((i) => i._id === placedItem.itemId)
        if (!item) continue

        const bounds = getShelfBounds(placedItem.column, placedItem.shelfIndex)
        if (!bounds) continue

        const displayWidth = item.displayWidth || DEFAULT_DIMENSIONS.width
        const displayHeight = item.displayHeight || DEFAULT_DIMENSIONS.height
        const itemWidth = (displayWidth * MM_TO_PX * rect.width) / 1000
        const itemHeight = (displayHeight * MM_TO_PX * rect.width) / 1000

        const shelfX = bounds.x * rect.width
        const shelfY = bounds.y * rect.height
        const shelfWidth = bounds.width * rect.width
        const shelfHeight = bounds.height * rect.height

        const itemX = shelfX + placedItem.x * shelfWidth - itemWidth / 2
        const itemY = shelfY + placedItem.y * shelfHeight - itemHeight

        if (
          x >= itemX &&
          x <= itemX + itemWidth &&
          y >= itemY &&
          y <= itemY + itemHeight
        ) {
          setDraggedItem(placedItem)
          setDragOffset({ x: x - itemX, y: y - itemY })
          setIsDragging(true)
          onItemSelect?.(placedItem.itemId)
          return
        }
      }
    },
    [shelfState.items, items, getShelfBounds, onItemSelect]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !draggedItem) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const shelfInfo = getShelfFromPoint(x, y, rect.width, rect.height)
      if (shelfInfo) {
        setShelfState((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.itemId === draggedItem.itemId
              ? {
                  ...item,
                  column: shelfInfo.column,
                  shelfIndex: shelfInfo.shelfIndex,
                  x: shelfInfo.relativeX,
                  y: shelfInfo.relativeY,
                }
              : item
          ),
        }))
      }
    },
    [isDragging, draggedItem, getShelfFromPoint]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging && draggedItem) {
      setIsDragging(false)
      setDraggedItem(null)
    }
  }, [isDragging, draggedItem])

  // Handle drop from item picker
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const itemId = e.dataTransfer.getData('text/plain')
      if (!itemId) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const shelfInfo = getShelfFromPoint(x, y, rect.width, rect.height)
      if (!shelfInfo) return

      // Check if item already exists
      const existingIndex = shelfState.items.findIndex((item) => item.itemId === itemId)
      if (existingIndex >= 0) {
        // Update existing item position
        setShelfState((prev) => ({
          ...prev,
          items: prev.items.map((item, idx) =>
            idx === existingIndex
              ? {
                  ...item,
                  column: shelfInfo.column,
                  shelfIndex: shelfInfo.shelfIndex,
                  x: shelfInfo.relativeX,
                  y: shelfInfo.relativeY,
                }
              : item
          ),
        }))
      } else {
        // Add new item
        setShelfState((prev) => ({
          ...prev,
          items: [
            ...prev.items,
            {
              itemId,
              column: shelfInfo.column,
              shelfIndex: shelfInfo.shelfIndex,
              x: shelfInfo.relativeX,
              y: shelfInfo.relativeY,
            },
          ],
        }))
      }
    },
    [shelfState.items, getShelfFromPoint]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault()
  }, [])

  // Handle item removal (double click)
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Find clicked item
      for (const placedItem of shelfState.items) {
        const item = items.find((i) => i._id === placedItem.itemId)
        if (!item) continue

        const bounds = getShelfBounds(placedItem.column, placedItem.shelfIndex)
        if (!bounds) continue

        const displayWidth = item.displayWidth || DEFAULT_DIMENSIONS.width
        const displayHeight = item.displayHeight || DEFAULT_DIMENSIONS.height
        const itemWidth = (displayWidth * MM_TO_PX * rect.width) / 1000
        const itemHeight = (displayHeight * MM_TO_PX * rect.width) / 1000

        const shelfX = bounds.x * rect.width
        const shelfY = bounds.y * rect.height
        const shelfWidth = bounds.width * rect.width
        const shelfHeight = bounds.height * rect.height

        const itemX = shelfX + placedItem.x * shelfWidth - itemWidth / 2
        const itemY = shelfY + placedItem.y * shelfHeight - itemHeight

        if (
          x >= itemX &&
          x <= itemX + itemWidth &&
          y >= itemY &&
          y <= itemY + itemHeight
        ) {
          // Remove item
          setShelfState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.itemId !== placedItem.itemId),
          }))
          return
        }
      }
    },
    [shelfState.items, items, getShelfBounds]
  )

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] bg-white border border-neutral-200">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  )
}

