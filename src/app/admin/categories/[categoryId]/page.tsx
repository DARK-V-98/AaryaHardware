
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Category } from '@/lib/data';
import { CategoryForm } from '../new/category-form';
import { Loader2 } from 'lucide-react';

interface EditCategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function EditCategoryPage({ params: { categoryId } }: EditCategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const docRef = doc(firestore, 'categories', categoryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCategory({ id: docSnap.id, ...docSnap.data() } as Category);
        } else {
          setError(true);
          console.log('No such document!');
        }
      } catch (err) {
        setError(true);
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);

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
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="text-muted-foreground mt-2">The category you are looking for does not exist.</p>
      </div>
    );
  }
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}
