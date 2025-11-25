import { Navigation } from '@/components/ui/Navigation';
import { ETrackRowGrid } from '@/components/ui/ETrackRowGrid';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getHomepageItems } from '@/lib/sanity';

export default async function Home() {
  const items = await getHomepageItems();

  const navLinks = [
    { href: '/', label: 'Home', active: true },
    { href: '/about', label: 'About', active: false },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="lg" className="py-0 md:py-24">
          <Container size="lg">
            <ETrackRowGrid
              items={items}
              columns={3}
              rowSpacing="none"
            />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
