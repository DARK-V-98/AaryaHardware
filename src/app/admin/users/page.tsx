
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { UserData } from '@/lib/data';
import { UserClient } from './components/client';
import { UserColumn } from './components/columns';
import { Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'users'), orderBy('email'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allUsers: UserData[] = [];
      querySnapshot.forEach((doc) => {
        allUsers.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(allUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
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

  const formattedUsers: UserColumn[] = users.map((item) => ({
    id: item.id,
    email: item.email,
    role: item.role,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <UserClient data={formattedUsers} />
      </div>
    </div>
  );
}
