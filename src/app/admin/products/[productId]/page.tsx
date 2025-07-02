
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Product, Category } from '@/lib/data';
import { ProductForm } from '../new/product-form';
import { Loader2 } from 'lucide-react';

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesCollection = await getDocs(collection(firestore, 'categories'));
        const cats = categoriesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);

        // Fetch product
        const docRef = doc(firestore, 'products', params.productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError(true);
          console.log('No such document!');
        }
      } catch (err) {
        setError(true);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col justify-center items-center text-center py-16">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
      </div>
    );
  }
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}
