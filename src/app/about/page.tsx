import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading, BodyText } from '@/components/ui/Typography';
import { ImageDisplay } from '@/components/ui/ImageDisplay';
import { ETrackContainer } from '@/components/ui/ETrackContainer';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the 606+ catalogue, a personal project documenting timeless design objects that share the Vitsoe 606 Universal Shelving System's principles of permanence, precision, and function.",
  openGraph: {
    title: "About | 606+",
    description: "Learn about the 606+ catalogue, a personal project documenting timeless design objects inspired by Dieter Rams' Vitsoe 606 system.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/606-Universal-Shelving-System.jpg`,
        width: 1200,
        height: 630,
        alt: "Vitsoe 606 Universal Shelving System, designed by Dieter Rams, 1960",
      },
    ],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  const navLinks = [
    { href: '/', label: 'Home', active: false },
    { href: '/about', label: 'About', active: true },
  ];

  const vitsoe606Image = '/606-Universal-Shelving-System.jpg';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation links={navLinks} />
      
      <main className="flex-1">
        <Section spacing="xl">
          <Container size="md">
            <ETrackContainer left right className="hidden md:block">
              <div className="max-w-3xl mx-auto px-8">
                <Heading level={1} className="mb-8 text-center">
                  About
                </Heading>
                
                <div className="mb-12">
                  <ImageDisplay 
                    src={vitsoe606Image}
                    alt="Vitsoe 606 Universal Shelving System"
                    aspectRatio="wide"
                    caption="Vitsoe 606 Universal Shelving System, designed by Dieter Rams, 1960"
                  />
                </div>

                <div className="space-y-6">
                  <BodyText size="lg" weight="light">
                    <a href="https://www.vitsoe.com/gb/606" className="text-neutral-900 underline hover:text-neutral-600 transition-colors" target="_blank">The Vitsoe 606 Universal Shelving System, designed by Dieter Rams</a> in 1960, embodies a philosophy of permanence and precision. It is furniture that adapts to changing needs rather than becoming obsolete—a system built to last generations, not seasons.
                  </BodyText>

                  <BodyText>
                    This catalogue exists to document objects that share the 606 system&apos;s DNA: designs that prioritize function over fashion, precision over decoration, and timelessness over trends. Each object has been selected not merely for aesthetic compatibility, but for its alignment with the same principles that make 606 enduring—principles that transcend categories, eras, and makers. Together, they form a collection that demonstrates good design is recognizable, universal, and permanent.
                  </BodyText>

                  <BodyText>
                    This is a personal project by me, Jeshua Maxey. It has no official affiliation with Vitsoe. I maintain it on an ad hoc basis as I discover new objects. I&apos;m interested in hearing about how others use Vitsoe 606 and welcome suggestions for new objects to add to this collection. You can reach me at{' '}
                    <a 
                      href="mailto:jeshua@me.com" 
                      className="text-neutral-900 underline hover:text-neutral-600 transition-colors"
                    >
                      me@jeshua.co
                    </a>
                    .
                  </BodyText>
                </div>
              </div>
            </ETrackContainer>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

