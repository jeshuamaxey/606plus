import { Navigation } from '@/components/ui/Navigation'
import { Footer } from '@/components/ui/Footer'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading, BodyText } from '@/components/ui/Typography'
import { ShelfCanvas } from '@/components/ui/ShelfCanvas'
import { ItemPicker } from '@/components/ui/ItemPicker'
import { getAllItemsForShelves } from '@/lib/sanity'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev'

export const metadata: Metadata = {
  title: 'My 606 | 606+',
  description: 'Visualize design objects on Vitsoe 606 shelves. Arrange and explore how items complement the 606 system.',
  openGraph: {
    title: 'My 606 | 606+',
    description: 'Visualize design objects on Vitsoe 606 shelves. Arrange and explore how items complement the 606 system.',
    url: `${siteUrl}/my-606`,
    images: [
      {
        url: `${siteUrl}/606-Universal-Shelving-System.jpg`,
        width: 1200,
        height: 630,
        alt: 'Vitsoe 606 Universal Shelving System',
      },
    ],
  },
  alternates: {
    canonical: `${siteUrl}/my-606`,
  },
}

export default async function My606Page() {
  const items = await getAllItemsForShelves()

  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/about', label: 'About', active: false },
    { href: '/my-606', label: 'My 606', active: true },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />

      <main className="flex-1">
        <Section spacing="lg" className="py-8">
          <Container size="lg">
            {/* Header */}
            <div className="mb-8">
              <Heading level={1} className="mb-4">
                My 606
              </Heading>
              <BodyText size="md" weight="light" className="text-neutral-600 max-w-2xl">
                Arrange design objects on Vitsoe 606 shelves. Drag items from the picker onto the
                shelves to visualize how they complement the system. Double-click items to remove
                them.
              </BodyText>
            </div>

            {/* Main content area */}
            <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-300px)] min-h-[600px]">
              {/* Shelf canvas - takes up most of the space */}
              <div className="flex-1 h-full">
                <ShelfCanvas items={items} />
              </div>

              {/* Item picker - sidebar */}
              <div className="w-full lg:w-80 h-full lg:h-auto lg:max-h-full">
                <ItemPicker items={items} />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

