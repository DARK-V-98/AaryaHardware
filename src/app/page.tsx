
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import { MapPin, Phone, Loader2 } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { firestore } from '@/lib/firebase';
import { Product, Category } from '@/lib/data';
import { ProductDetailModal } from '@/components/product-detail-modal';


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'products'), 
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching featured products: ", error);
      setLoading(false);
    });
    
    const categoriesUnsubscribe = onSnapshot(collection(firestore, 'categories'), (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);
    });

    return () => {
        unsubscribe();
        categoriesUnsubscribe();
    };
  }, []);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);


  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-40 bg-background text-foreground overflow-hidden">
          <div className="container mx-auto px-4 text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl font-bold font-headline mb-4 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              Elegance in Every Detail
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              Discover our collection of hardware that combines modern design with timeless quality.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
              <Button size="lg" className="mt-8" asChild>
                <a href="/products">Shop Collection</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
                Featured Products
                </h2>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-12 w-12 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                   <div 
                    key={product.id} 
                    onClick={() => setSelectedProduct(product)} 
                    className="cursor-pointer animate-in fade-in-0 slide-in-from-bottom-5 duration-700 fill-mode-both"
                    style={{ animationDelay: `${150 * index}ms` }}
                    >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="about" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 animate-in fade-in-0 slide-in-from-left-10 duration-1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Aarya Hardware</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aarya Hardware is a premier destination for high-quality, design-forward hardware and accessories. We believe that every space should be both functional and beautiful. That's why we meticulously source and curate a collection of products that embody elegance, innovation, and durability. Our mission is to help you create a space that is not only functional but also a true reflection of your personal style.
              </p>
            </div>
             <div className="order-1 md:order-2 animate-in fade-in-0 slide-in-from-right-10 duration-1000">
                <Image 
                    src="https://placehold.co/800x600.png"
                    alt="Stylish faucet detail"
                    width={800}
                    height={600}
                    className="rounded-lg shadow-xl object-cover"
                    data-ai-hint="hardware showroom"
                />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="animate-in fade-in-0 duration-500">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get In Touch</h2>
            </div>
            <div className="max-w-lg mx-auto bg-card p-8 md:p-12 rounded-xl shadow-lg border animate-in fade-in-0 zoom-in-95 duration-700 delay-200">
                <div className="text-center space-y-6">
                    <h3 className="text-2xl font-semibold">Our Showroom</h3>
                    <p className="text-muted-foreground">
                    Visit us to experience our collection firsthand. Our team is ready to assist you.
                    </p>
                    <div className="space-y-4 inline-block text-left pt-2">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <p className="text-muted-foreground">Aarya Hardware No. 377 old kottawa road,<br/>kottawa</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                            <p className="text-muted-foreground">+94782404099</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
       {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          categoryName={categoryMap.get(selectedProduct.categoryId) || "Uncategorized"}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
