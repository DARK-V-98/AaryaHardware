
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Product, Category } from '@/lib/data';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const productsQuery = query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    const productsUnsubscribe = onSnapshot(productsQuery, (querySnapshot) => {
      const prods: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setProductsLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setProductsLoading(false);
    });

    const categoriesQuery = query(collection(firestore, 'categories'));
    const categoriesUnsubscribe = onSnapshot(categoriesQuery, (querySnapshot) => {
      const cats: Category[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
      setCategoriesLoading(false);
    }, (error) => {
      console.error("Error fetching categories: ", error);
      setCategoriesLoading(false);
    });

    return () => {
      productsUnsubscribe();
      categoriesUnsubscribe();
    };
  }, []);
  
  const loading = productsLoading || categoriesLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price.toFixed(2),
    discountPrice: item.discountPrice ? item.discountPrice.toFixed(2) : undefined,
    category: categoryMap.get(item.categoryId) || "Uncategorized",
    featured: item.featured,
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    additionalImageUrls: item.additionalImageUrls,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
