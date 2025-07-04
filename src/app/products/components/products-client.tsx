
'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ProductCard } from "@/components/product-card";
import { firestore } from '@/lib/firebase';
import { Product, Category } from '@/lib/data';
import { Loader2, Search } from 'lucide-react';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // We fetch all products and sort by date initially. Filtering will be done client-side.
    const q = query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
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

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    const sorted = filtered.sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - a.price;
        case 'date-desc':
        default:
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
      }
    });

    return sorted;
  }, [products, searchTerm, sortOption, selectedCategory]);


  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Our Bathware & Hardware Collection
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Browse our curated selection of quality bathware and hardware available in Sri Lanka. Use the filters below to find exactly what you need for your project.
          </p>

          {/* Filter and Sort Controls */}
          <Card className="mb-8 p-4 bg-card">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date-desc">Newest Arrivals</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

            {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((product) => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                  <ProductCard {...product} className="bg-card" />
                </div>
              ))}
            </div>
          ) : (
              <Card className="text-center py-16 bg-card">
                  <h2 className="text-2xl font-semibold">No Products Found</h2>
                  <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </Card>
          )}
        </div>
      </section>
      {selectedProduct && (
      <ProductDetailModal
        product={selectedProduct}
        categoryName={categoryMap.get(selectedProduct.categoryId) || "Uncategorized"}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    )}
  </>
  );
}
