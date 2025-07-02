
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Order, OrderStatus } from '@/lib/data';
import { Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        userOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(userOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
        case 'Pending Payment': return 'secondary';
        case 'Processing': return 'default';
        case 'Shipped': return 'default';
        case 'Completed': return 'default';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View your complete order history.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>{format(order.createdAt.toDate(), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">LKR {order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button asChild variant="outline" size="icon">
                          <Link href={`/profile/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Order</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>You haven't placed any orders yet.</p>
              <Button asChild className="mt-4">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
