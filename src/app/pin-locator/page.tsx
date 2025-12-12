'use client'

import { useState, useEffect, useRef } from 'react'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, BodyText } from '@/components/ui/Typography'

interface PinLocation {
  x: number
  y: number
  viewBox?: string
}

interface PinData {
  [filename: string]: PinLocation
}

// Component to render pin marker overlay
function PinMarker({
  pin,
  svg,
  viewBox,
}: {
  pin: PinLocation
  svg: SVGSVGElement
  viewBox: string
}) {
  const rect = svg.getBoundingClientRect()
  const vb = viewBox.split(' ').map(Number)

  let markerX: number
  let markerY: number

  if (vb.length === 4 && !isNaN(vb[0]) && !isNaN(vb[1]) && !isNaN(vb[2]) && !isNaN(vb[3])) {
    // Convert SVG coordinates to pixel coordinates
    const viewBoxWidth = vb[2]
    const viewBoxHeight = vb[3]
    const svgWidth = rect.width
    const svgHeight = rect.height
    markerX = ((pin.x - vb[0]) / viewBoxWidth) * svgWidth
    markerY = ((pin.y - vb[1]) / viewBoxHeight) * svgHeight
  } else {
    // Use coordinates directly
    markerX = pin.x
    markerY = pin.y
  }

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${markerX}px`,
        top: `${markerY}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="w-4 h-4 border-2 border-red-500 rounded-full bg-red-500/20"></div>
    </div>
  )
}

export default function PinLocatorPage() {
  const [svgFiles, setSvgFiles] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pinData, setPinData] = useState<PinData>({})
  const [svgContent, setSvgContent] = useState<string>('')
  const [viewBox, setViewBox] = useState<string>('')
  const [zoom, setZoom] = useState(1)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load SVG file list
  useEffect(() => {
    // Fetch list of SVG files from the API
    fetch('/api/pin-locator/svgs')
      .then((res) => res.json())
      .then((data) => {
        console.log('SVG files response:', data)
        if (data.files && data.files.length > 0) {
          setSvgFiles(data.files)
          loadSvg(data.files[0])
        } else if (data.error) {
          console.error('API error:', data.error, 'Path:', data.path)
        }
      })
      .catch((err) => {
        console.error('Error loading SVG files:', err)
      })
  }, [])

  // Load SVG content
  const loadSvg = async (filename: string) => {
    try {
      const response = await fetch(`/606/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`)
      }
      const text = await response.text()

      // Parse and modify SVG to ensure it displays fully
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(text, 'image/svg+xml')
      const svgElement = svgDoc.querySelector('svg')
      
      if (svgElement) {
        // Extract viewBox
        const vb = svgElement.getAttribute('viewBox') || svgElement.getAttribute('width') || '0 0 100 100'
        setViewBox(vb)
        
        // Remove width/height attributes that might cause clipping
        svgElement.removeAttribute('width')
        svgElement.removeAttribute('height')
        
        // Ensure viewBox is set for proper scaling
        if (!svgElement.getAttribute('viewBox') && vb.includes(' ')) {
          svgElement.setAttribute('viewBox', vb)
        }
        
        // Set preserveAspectRatio
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        
        // Get modified SVG as string
        const modifiedSvg = new XMLSerializer().serializeToString(svgDoc)
        setSvgContent(modifiedSvg)
      } else {
        setSvgContent(text)
      }
    } catch (error) {
      console.error('Error loading SVG:', error)
    }
  }

  // Handle SVG click to set pin location
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return

    e.stopPropagation()

    const rect = svg.getBoundingClientRect()
    // Account for zoom when calculating click position
    const clickX = (e.clientX - rect.left) / zoom
    const clickY = (e.clientY - rect.top) / zoom

    // Get SVG viewBox for coordinate conversion
    const vb = viewBox.split(' ').map(Number)
    const svgWidth = rect.width / zoom
    const svgHeight = rect.height / zoom

    // Convert click coordinates to SVG coordinate space
    let svgX: number
    let svgY: number

    if (vb.length === 4 && !isNaN(vb[0]) && !isNaN(vb[1]) && !isNaN(vb[2]) && !isNaN(vb[3])) {
      // Has viewBox: [minX, minY, width, height]
      const viewBoxWidth = vb[2]
      const viewBoxHeight = vb[3]
      svgX = (clickX / svgWidth) * viewBoxWidth + vb[0]
      svgY = (clickY / svgHeight) * viewBoxHeight + vb[1]
    } else {
      // Try to get width/height from SVG element
      const svgWidthAttr = svg.getAttribute('width')
      const svgHeightAttr = svg.getAttribute('height')
      if (svgWidthAttr && svgHeightAttr) {
        const width = parseFloat(svgWidthAttr) || svgWidth
        const height = parseFloat(svgHeightAttr) || svgHeight
        svgX = (clickX / svgWidth) * width
        svgY = (clickY / svgHeight) * height
      } else {
        // Fallback: use pixel coordinates
        svgX = clickX
        svgY = clickY
      }
    }

    const currentFile = svgFiles[currentIndex]
    if (currentFile) {
      setPinData((prev) => ({
        ...prev,
        [currentFile]: {
          x: Math.round(svgX * 100) / 100, // Round to 2 decimal places
          y: Math.round(svgY * 100) / 100,
          viewBox: viewBox || undefined,
        },
      }))
    }
  }

  // Navigate to next/previous SVG
  const goToNext = () => {
    if (currentIndex < svgFiles.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      loadSvg(svgFiles[nextIndex])
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      loadSvg(svgFiles[prevIndex])
    }
  }

  // Go to specific file
  const goToFile = (index: number) => {
    setCurrentIndex(index)
    loadSvg(svgFiles[index])
    setZoom(1) // Reset zoom when changing files
  }

  // Zoom functions
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setZoom(1)
  }

  // Clear pin for current file
  const clearPin = () => {
    const currentFile = svgFiles[currentIndex]
    if (currentFile) {
      setPinData((prev) => {
        const updated = { ...prev }
        delete updated[currentFile]
        return updated
      })
    }
  }

  const currentFile = svgFiles[currentIndex]
  const currentPin = currentFile ? pinData[currentFile] : null

  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/about', label: 'About', active: false },
    { href: '/my-606', label: 'My 606', active: false },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />

      <main className="flex-1">
        <Section spacing="lg">
          <Container size="lg">
            <div className="mb-8">
              <Heading level={1} className="mb-4">
                Pin Location Locator
              </Heading>
              <BodyText size="md" weight="light" className="text-neutral-600">
                Click on the top-right pin location in each SVG to mark its position. Navigate
                through files using the gallery or arrow buttons.
              </BodyText>
            </div>

            {/* Main gallery area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* SVG viewer - takes 3 columns */}
              <div className="lg:col-span-3">
                <div className="bg-neutral-50 border border-neutral-200 rounded p-6">
                  {svgFiles.length > 0 && currentFile ? (
                    <div className="space-y-4">
                      {/* File info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <BodyText size="sm" className="font-medium">
                            {currentFile}
                          </BodyText>
                          <BodyText size="sm" className="text-neutral-600">
                            {currentIndex + 1} of {svgFiles.length}
                          </BodyText>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={goToNext}
                            disabled={currentIndex === svgFiles.length - 1}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      {/* SVG display */}
                      <div className="space-y-2">
                        {/* Zoom controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={zoomOut}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                            title="Zoom out"
                          >
                            −
                          </button>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.25"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <button
                            onClick={zoomIn}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                            title="Zoom in"
                          >
                            +
                          </button>
                          <span className="text-sm text-neutral-600 min-w-[60px]">
                            {Math.round(zoom * 100)}%
                          </span>
                          <button
                            onClick={resetZoom}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-100"
                            title="Reset zoom"
                          >
                            Reset
                          </button>
                        </div>
                        <div
                          ref={containerRef}
                          className="bg-white border border-neutral-300 rounded p-4"
                          style={{ minHeight: '400px', maxHeight: '800px', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <div className="relative cursor-crosshair" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '400px' }}>
                            {svgContent && (
                              <div 
                                className="relative" 
                                style={{ 
                                  display: 'inline-block',
                                  transform: `scale(${zoom})`,
                                  transformOrigin: 'center center'
                                }}
                              >
                                <svg
                                  ref={svgRef}
                                  onClick={handleSvgClick}
                                  style={{ 
                                    display: 'block', 
                                    maxWidth: '100%', 
                                    height: 'auto',
                                    maxHeight: '800px'
                                  }}
                                  dangerouslySetInnerHTML={{ __html: svgContent }}
                                />
                                {/* Pin marker overlay */}
                                {currentPin && svgRef.current && (
                                  <PinMarker
                                    pin={currentPin}
                                    svg={svgRef.current}
                                    viewBox={viewBox}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Current pin info */}
                      {currentPin ? (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <BodyText size="sm" className="text-green-800">
                            Pin located at: X={currentPin.x}, Y={currentPin.y}
                          </BodyText>
                          <button
                            onClick={clearPin}
                            className="mt-2 text-sm text-green-700 hover:text-green-900 underline"
                          >
                            Clear pin
                          </button>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <BodyText size="sm" className="text-yellow-800">
                            Click on the SVG to mark the pin location
                          </BodyText>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BodyText size="md" className="text-neutral-500">
                        {svgFiles.length === 0
                          ? 'No SVG files found. Please add SVG files to the public/606 directory.'
                          : 'Loading SVG...'}
                      </BodyText>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery - takes 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-neutral-50 border border-neutral-200 rounded p-4">
                  <BodyText size="sm" className="font-medium mb-4">
                    Gallery ({svgFiles.length} files)
                  </BodyText>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {svgFiles.map((file, index) => {
                      const hasPin = !!pinData[file]
                      return (
                        <button
                          key={file}
                          onClick={() => goToFile(index)}
                          className={`w-full p-2 text-left border rounded transition-colors ${
                            index === currentIndex
                              ? 'border-neutral-900 bg-neutral-100'
                              : hasPin
                              ? 'border-green-500 bg-green-50'
                              : 'border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          <BodyText size="xs" className="truncate">
                            {file}
                          </BodyText>
                          {hasPin && (
                            <BodyText size="xs" className="text-green-600 mt-1">
                              ✓ Pin set
                            </BodyText>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* JSON output */}
            <div className="bg-neutral-900 text-neutral-100 rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <Heading level={2} className="text-white text-xl">
                  Pin Locations JSON
                </Heading>
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(pinData, null, 2)
                    const blob = new Blob([jsonStr], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'pin-locations.json'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                >
                  Download JSON
                </button>
              </div>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(pinData, null, 2)}
              </pre>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

