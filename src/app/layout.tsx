
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

export const metadata: Metadata = {
  title: 'Aarya Bathware',
  description: 'Elegant bathware and quality hardware for your home.',
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
        <div 
            className="fixed inset-0 -z-20 h-full w-full bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: "url('/169.jpg')" }} 
        />
        <div className="fixed inset-0 -z-10 h-full w-full bg-white/60 backdrop-blur-xl" />
        <div className="min-h-screen flex flex-col bg-transparent">
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
