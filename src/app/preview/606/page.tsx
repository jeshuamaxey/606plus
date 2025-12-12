'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, BodyText } from '@/components/ui/Typography'
import { SixZeroSixPreview } from '@/components/ui/SixZeroSixPreview'

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

const DEFAULT_CONFIG: SixZeroSixConfig = {
  columns: [
    {
      type: 'narrow',
      furniture: [
        { filename: 'shelf-30.svg', height: 5 },
      ],
    },
    {
      type: 'wide',
      furniture: [
        { filename: 'shelf-30.svg', height: 3 },
        { filename: 'shelf-22.svg', height: 8 },
      ],
    },
  ],
}

export default function Preview606Page() {
  const [configJson, setConfigJson] = useState<string>('')
  const [config, setConfig] = useState<SixZeroSixConfig>(DEFAULT_CONFIG)
  const [pinLocations, setPinLocations] = useState<PinLocations>({})
  const [error, setError] = useState<string>('')

  // Load pin locations
  useEffect(() => {
    fetch('/606/_pin-locations.json')
      .then((res) => res.json())
      .then((data) => {
        setPinLocations(data)
      })
      .catch((err) => {
        console.error('Error loading pin locations:', err)
      })
  }, [])

  // Initialize config JSON
  useEffect(() => {
    setConfigJson(JSON.stringify(DEFAULT_CONFIG, null, 2))
  }, [])

  // Parse and update config when JSON changes
  useEffect(() => {
    if (!configJson.trim()) {
      setConfig(DEFAULT_CONFIG)
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(configJson) as SixZeroSixConfig
      
      // Validate structure
      if (!parsed.columns || !Array.isArray(parsed.columns)) {
        throw new Error('Config must have a "columns" array')
      }

      parsed.columns.forEach((col, idx) => {
        if (col.type !== 'narrow' && col.type !== 'wide') {
          throw new Error(`Column ${idx} must have type "narrow" or "wide"`)
        }
        if (!col.furniture || !Array.isArray(col.furniture)) {
          throw new Error(`Column ${idx} must have a "furniture" array`)
        }
        col.furniture.forEach((piece, pIdx) => {
          if (!piece.filename || typeof piece.filename !== 'string') {
            throw new Error(`Column ${idx}, furniture ${pIdx} must have a "filename" string`)
          }
          if (typeof piece.height !== 'number' || piece.height < 0) {
            throw new Error(`Column ${idx}, furniture ${pIdx} must have a "height" number >= 0`)
          }
        })
      })

      setConfig(parsed)
      setError('')
    } catch (err: any) {
      setError(err.message || 'Invalid JSON')
    }
  }, [configJson])

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
                606 Preview
              </Heading>
              <BodyText size="md" weight="light" className="text-neutral-600">
                Configure and preview your 606 furniture layout. Edit the JSON below to define
                columns and furniture placement.
              </BodyText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* JSON Editor */}
              <div className="space-y-4">
                <div>
                  <Heading level={2} className="text-lg mb-2">
                    Configuration JSON
                  </Heading>
                  {error && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      {error}
                    </div>
                  )}
                  <textarea
                    value={configJson}
                    onChange={(e) => setConfigJson(e.target.value)}
                    className="w-full h-[600px] p-4 font-mono text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <div>
                  <Heading level={2} className="text-lg mb-2">
                    Preview
                  </Heading>
                  <div className="bg-neutral-50 border border-neutral-200 rounded p-4">
                    {Object.keys(pinLocations).length > 0 ? (
                      <SixZeroSixPreview config={config} pinLocations={pinLocations} />
                    ) : (
                      <div className="text-center py-12">
                        <BodyText size="sm" className="text-neutral-500">
                          Loading pin locations...
                        </BodyText>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* JSON Format Help */}
            <div className="bg-neutral-50 border border-neutral-200 rounded p-6">
              <Heading level={2} className="text-lg mb-4">
                JSON Format
              </Heading>
              <div className="space-y-2 text-sm">
                <BodyText size="sm">
                  <strong>Structure:</strong>
                </BodyText>
                <pre className="bg-white p-4 rounded border border-neutral-200 overflow-x-auto text-xs">
{`{
  "columns": [
    {
      "type": "narrow" | "wide",
      "furniture": [
        {
          "filename": "shelf-30.svg",
          "height": 5  // Height from bottom in e-track holes
        }
      ]
    }
  ]
}`}
                </pre>
                <BodyText size="sm" className="mt-4">
                  <strong>Notes:</strong>
                </BodyText>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 ml-4">
                  <li>Narrow bays are 66.7cm wide</li>
                  <li>Wide bays are 91.2cm wide</li>
                  <li>E-track holes are spaced 4cm apart</li>
                  <li>Height is measured from the bottom in e-track holes</li>
                  <li>Furniture is positioned using pin locations from <code className="bg-neutral-200 px-1 rounded">_pin-locations.json</code></li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

