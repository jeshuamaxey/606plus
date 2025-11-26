import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';

export default function NotFound() {
  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/about', label: 'About', active: false },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="lg">
          <Container size="md">
            <div className="text-center">
              <Heading level={1} className="mb-4">
                Item Not Found
              </Heading>
              <BodyText size="lg" className="mb-8">
                The item you're looking for doesn't exist or has been removed.
              </BodyText>
              <Link 
                href="/" 
                className="inline-block px-6 py-3 bg-neutral-900 text-white font-medium transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
              >
                Return to Home
              </Link>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

