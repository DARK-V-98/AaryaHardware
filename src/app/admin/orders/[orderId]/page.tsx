
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Order } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { StatusUpdater } from './status-updater';
import { Badge } from '@/components/ui/badge';


interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderPage({ params: { orderId } }: OrderPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(firestore, 'orders', orderId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching order:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-16">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-muted-foreground mt-2">The order you are looking for does not exist.</p>
      </div>
    );
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Pending Payment':
            return 'secondary';
        case 'Processing':
            return 'default';
        case 'Shipped':
            return 'default';
        case 'Completed':
            return 'default';
        case 'Cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold">Order Details</h1>
                <p className="text-muted-foreground">Order ID: {order.id}</p>
                 <p className="text-sm text-muted-foreground">
                    Placed on: {format(order.createdAt.toDate(), 'MMMM do, yyyy, h:mm a')}
                </p>
            </div>
             <Badge variant={getStatusVariant(order.status)} className="text-lg py-1 px-3 capitalize">
                {order.status}
             </Badge>
        </div>
        <Separator />
      
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {order.items.map(item => (
                                <li key={item.productId} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x LKR {item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-semibold">LKR {(item.quantity * item.price).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                        <Separator className="my-4"/>
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>LKR {order.totalAmount.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-medium">{order.shippingAddress.name}</p>
                        <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                        <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                        <p className="text-muted-foreground pt-2">
                            {order.shippingAddress.addressLine1}<br/>
                            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusUpdater orderId={order.id} currentStatus={order.status} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
