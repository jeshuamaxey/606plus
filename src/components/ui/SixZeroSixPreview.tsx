'use client'

import { useEffect, useRef, useState } from 'react'

// Constants
const ETRACK_PIN_SPACING_CM = 4 // Distance between e-track holes in cm
const NARROW_BAY_WIDTH_CM = 66.7
const WIDE_BAY_WIDTH_CM = 91.2

// Scale factor: 1cm = X pixels (adjust based on desired display size)
const CM_TO_PX = 2 // 1cm = 2px

interface PinLocation {
  x: number
  y: number
  viewBox?: string
}

interface PinLocations {
  [filename: string]: PinLocation
}

interface FurniturePiece {
  filename: string
  height: number // Height from bottom in e-track holes
}

interface Column {
  type: 'narrow' | 'wide'
  furniture: FurniturePiece[]
}

interface SixZeroSixConfig {
  columns: Column[]
}

interface SixZeroSixPreviewProps {
  config: SixZeroSixConfig
  pinLocations: PinLocations
}

export function SixZeroSixPreview({ config, pinLocations }: SixZeroSixPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Load all SVG files as images
  useEffect(() => {
    const imageMap = new Map<string, HTMLImageElement>()
    const loadPromises: Promise<void>[] = []

    config.columns.forEach((column) => {
      column.furniture.forEach((piece) => {
        if (!imageMap.has(piece.filename)) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          const promise = new Promise<void>((resolve, reject) => {
            img.onload = () => {
              imageMap.set(piece.filename, img)
              resolve()
            }
            img.onerror = () => {
              console.error(`Failed to load ${piece.filename}`)
              resolve() // Continue even if image fails
            }
            img.src = `/606/${piece.filename}`
          })
          
          loadPromises.push(promise)
        }
      })
    })

    Promise.all(loadPromises).then(() => {
      setLoadedImages(imageMap)
    })
  }, [config])

  // Calculate total width and max height
  const totalWidth = config.columns.reduce((sum, col) => {
    return sum + (col.type === 'narrow' ? NARROW_BAY_WIDTH_CM : WIDE_BAY_WIDTH_CM)
  }, 0)

  const maxHeight = Math.max(
    ...config.columns.flatMap((col) => col.furniture.map((p) => p.height * ETRACK_PIN_SPACING_CM)),
    50 // Minimum height
  )

  // Calculate track positions
  let currentX = 0
  const trackPositions: number[] = [0] // Left edge track

  config.columns.forEach((column) => {
    const width = column.type === 'narrow' ? NARROW_BAY_WIDTH_CM : WIDE_BAY_WIDTH_CM
    currentX += width
    trackPositions.push(currentX)
  })

  // Draw function
  const draw = () => {
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

    // Calculate canvas dimensions
    const canvasWidth = totalWidth * CM_TO_PX
    const canvasHeight = (maxHeight + 50) * CM_TO_PX

    // Center the drawing area
    const offsetX = (width - canvasWidth) / 2
    const offsetY = (height - canvasHeight) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)

    // Draw e-tracks (n+1 tracks for n columns)
    ctx.strokeStyle = '#d4d4d4' // neutral-300
    ctx.lineWidth = 1

    trackPositions.forEach((position) => {
      const x = position * CM_TO_PX
      
      // Draw three vertical lines close together (e-track)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x + 2, 0)
      ctx.lineTo(x + 2, canvasHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x + 4, 0)
      ctx.lineTo(x + 4, canvasHeight)
      ctx.stroke()
    })

    // Draw e-track holes (horizontal dashed lines)
    ctx.strokeStyle = '#e5e5e5' // neutral-200
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])

    const numHoles = Math.ceil(maxHeight / ETRACK_PIN_SPACING_CM) + 1
    for (let i = 0; i <= numHoles; i++) {
      const y = i * ETRACK_PIN_SPACING_CM * CM_TO_PX
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // Draw furniture
    config.columns.forEach((column, columnIndex) => {
      const columnWidth = column.type === 'narrow' ? NARROW_BAY_WIDTH_CM : WIDE_BAY_WIDTH_CM
      const columnLeft = columnIndex === 0 ? 0 : trackPositions[columnIndex] * CM_TO_PX
      const columnRight = columnLeft + columnWidth * CM_TO_PX

      column.furniture.forEach((piece) => {
        const img = loadedImages.get(piece.filename)
        const pinLocation = pinLocations[piece.filename]

        if (!img || !pinLocation) {
          // Draw placeholder if image not loaded
          ctx.fillStyle = '#f5f5f5'
          ctx.fillRect(columnLeft, canvasHeight - 20, columnWidth * CM_TO_PX, 20)
          ctx.strokeStyle = '#d4d4d4'
          ctx.strokeRect(columnLeft, canvasHeight - 20, columnWidth * CM_TO_PX, 20)
          ctx.fillStyle = '#666'
          ctx.font = '10px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(
            piece.filename,
            columnLeft + (columnWidth * CM_TO_PX) / 2,
            canvasHeight - 5
          )
          return
        }

        // Get SVG dimensions from viewBox
        const viewBox = pinLocation.viewBox || '0 0 100 100'
        const vb = viewBox.split(' ').map(Number)
        const svgWidth = vb.length === 4 ? vb[2] : 100
        const svgHeight = vb.length === 4 ? vb[3] : 100

        // Calculate SVG dimensions in pixels
        const svgWidthPx = svgWidth * CM_TO_PX
        const svgHeightPx = svgHeight * CM_TO_PX

        // Pin position in SVG coordinate space (convert to pixels)
        const pinXInSvgPixels = (pinLocation.x / svgWidth) * svgWidthPx
        const pinYInSvgPixels = (pinLocation.y / svgHeight) * svgHeightPx

        // Calculate position: pin should be at column right edge and at height from bottom
        const heightFromBottom = piece.height * ETRACK_PIN_SPACING_CM * CM_TO_PX
        const pinY = canvasHeight - heightFromBottom

        // Position SVG so pin aligns with e-track
        const svgX = columnRight - pinXInSvgPixels
        const svgY = pinY - pinYInSvgPixels

        // Draw the image
        ctx.drawImage(img, svgX, svgY, svgWidthPx, svgHeightPx)
      })
    })

    ctx.restore()
  }

  // Redraw when images load or config changes
  useEffect(() => {
    draw()
  }, [config, loadedImages, pinLocations])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      draw()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [draw])

  return (
    <div ref={containerRef} className="relative bg-white border border-neutral-300 rounded p-8 overflow-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
