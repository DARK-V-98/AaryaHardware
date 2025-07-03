
import type { Metadata } from 'next';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductsClient } from './components/products-client';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Explore the complete collection of premium bathware and quality hardware from Aarya Bathware. Your leading hardware store in Sri Lanka for all your project needs.',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <ProductsClient />
      </main>
      <Footer />
    </div>
  );
}
