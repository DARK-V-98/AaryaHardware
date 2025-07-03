
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
  metadataBase: new URL('https://aarya-bathware.firebaseapp.com'),
  
  // Title template for dynamic titles
  title: {
    default: 'Aarya Bathware & Hardware | Quality Fixtures in Sri Lanka',
    template: `%s | Aarya Bathware & Hardware`,
  },
  
  // SEO-friendly description
  description: 'Aarya Bathware is your trusted hardware store in Sri Lanka for premium bathware, quality hardware, and home improvement essentials. Visit our showroom in Kottawa.',
  
  // Keywords for search engines
  keywords: ['Aarya Bathware', 'Aarya Hardware', 'hardware store Sri Lanka', 'bathware Sri Lanka', 'home improvement Kottawa', 'plumbing fixtures', 'bathroom accessories'],
  
  // Open Graph metadata for social sharing
  openGraph: {
    title: 'Aarya Bathware & Hardware | Quality Fixtures in Sri Lanka',
    description: 'Your trusted source for premium bathware and quality hardware in Sri Lanka.',
    url: 'https://aarya-bathware.firebaseapp.com',
    siteName: 'Aarya Bathware',
    images: [
      {
        url: '/ab.jpg', // Path to a good representative image
        width: 800,
        height: 600,
        alt: 'Aarya Bathware store interior',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Aarya Bathware & Hardware | Quality Fixtures in Sri Lanka',
    description: 'Discover premium bathware and quality hardware at Aarya Bathware, your top choice in Sri Lanka.',
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
