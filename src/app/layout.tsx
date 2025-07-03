
import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeadline = Lexend({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700'],
});


export const metadata: Metadata = {
  title: 'Aarya Hardware',
  description: 'Premium hardware solutions for modern homes.',
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
      <body className={cn("antialiased font-sans", fontSans.variable, fontHeadline.variable)}>
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
