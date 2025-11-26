import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono, Stack_Sans_Notch } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Stack Sans Notch - Bold display font for headings
// Available on Google Fonts: https://fonts.google.com/specimen/Stack+Sans+Notch
const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch",
  subsets: ["latin"],
  weight: "700", // Bold weight for display headings
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://606plus.jeshua.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "606+ | Design object catalogue",
    template: "%s | 606+",
  },
  description: "A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.",
  keywords: ["design catalogue", "Vitsoe 606", "timeless design", "Dieter Rams", "functional design", "minimalist furniture", "design collection"],
  authors: [{ name: "Jeshua Maxey", url: "https://jeshua.co" }],
  creator: "Jeshua Maxey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "606+",
    title: "606+ | Design object catalogue",
    description: "A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.",
    images: [
      {
        url: `${siteUrl}/606-Universal-Shelving-System.jpg`,
        width: 1200,
        height: 630,
        alt: "Vitsoe 606 Universal Shelving System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "606+ | Design object catalogue",
    description: "A curated collection of design objects that complement the Vitsoe 606 shelving system. Pleasing to the eye, rewarding to explore.",
    images: [`${siteUrl}/606-Universal-Shelving-System.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${stackSansNotch.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
