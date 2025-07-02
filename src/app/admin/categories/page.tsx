
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Category } from '@/lib/data';
import { CategoryClient } from './components/client';
import { CategoryColumn } from './components/columns';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'categories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cats: Category[] = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(cats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt ? format(item.createdAt.toDate(), 'MMMM do, yyyy') : 'N/A',
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
