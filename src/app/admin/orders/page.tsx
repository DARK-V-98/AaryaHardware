
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Order } from '@/lib/data';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        allOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(allOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
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

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    customer: item.shippingAddress.name,
    items: item.items.reduce((total, current) => total + current.quantity, 0),
    total: `LKR ${item.totalAmount.toFixed(2)}`,
    status: item.status,
    paymentMethod: item.paymentMethod,
    createdAt: format(item.createdAt.toDate(), 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
}
