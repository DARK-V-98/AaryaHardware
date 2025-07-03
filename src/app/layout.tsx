
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// SEO Optimized Metadata
export const metadata: Metadata = {
  // The base URL for the site
  metadataBase: new URL('https://www.aaryahardware.lk'),
  
  // Title template for dynamic titles
  title: {
    default: 'Aarya Hardware | Quality Bathware & Fixtures in Sri Lanka',
    template: `%s | Aarya Hardware`,
  },
  
  // SEO-friendly description
  description: 'Aarya Hardware is your trusted hardware store in Sri Lanka for premium bathware, quality hardware, and home improvement essentials. Visit our showroom in Kottawa.',
  
  // Keywords for search engines
  keywords: ['Aarya Hardware', 'hardware store Sri Lanka', 'bathware Sri Lanka', 'home improvement Kottawa', 'plumbing fixtures', 'bathroom accessories'],
  
  // Open Graph metadata for social sharing
  openGraph: {
    title: 'Aarya Hardware | Quality Bathware & Fixtures in Sri Lanka',
    description: 'Your trusted source for premium bathware and quality hardware in Sri Lanka.',
    url: 'https://www.aaryahardware.lk',
    siteName: 'Aarya Hardware',
    images: [
      {
        url: '/ab.jpg', // Path to a good representative image
        width: 800,
        height: 600,
        alt: 'Aarya Hardware store interior',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Aarya Hardware | Quality Bathware & Fixtures in Sri Lanka',
    description: 'Discover premium bathware and quality hardware at Aarya Hardware, your top choice in Sri Lanka.',
    images: ['/ab.jpg'], // Path to a good representative image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body className={cn("antialiased font-sans", fontSans.variable)}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
