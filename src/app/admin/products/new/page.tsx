
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Category } from '@/lib/data';
import { ProductForm } from "./product-form";
import { Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categories'));
        const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductForm initialData={null} categories={categories} />
      </div>
    </div>
  );
}
