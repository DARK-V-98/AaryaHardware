
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Order } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Banknote, Truck } from 'lucide-react';

export default function UserOrderPage() {
  const params = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    if (!params.orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
    };
    
    const docRef = doc(firestore, 'orders', params.orderId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
        if (orderData.userId === user.uid) {
            setOrder(orderData);
        } else {
            setError("You do not have permission to view this order.");
        }
      } else {
        setError("Order not found.");
      }
      setLoading(false);
    }, (err) => {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details.");
        setLoading(false);
    });

    return () => unsubscribe();
  }, [params.orderId, user, authLoading]);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Pending Payment': return 'secondary';
        case 'Processing': return 'default';
        case 'Shipped': return 'default';
        case 'Completed': return 'default';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-16">
        <h1 className="text-2xl font-bold">{error || "Order not found"}</h1>
        <p className="text-muted-foreground mt-2">The order you are looking for does not exist or you don't have access.</p>
         <Button asChild className="mt-6">
            <Link href="/profile">Back to My Orders</Link>
        </Button>
      </div>
    );
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
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-muted-foreground">
                        <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.email}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p className="pt-2">
                            {order.shippingAddress.addressLine1}<br/>
                            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br/></>}
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-2">
                         {order.paymentMethod === 'Bank Transfer' ? <Banknote /> : <Truck />}
                         <span className="font-medium">{order.paymentMethod}</span>
                       </div>
                       {order.paymentMethod === 'Bank Transfer' && order.status === 'Pending Payment' && (
                           <p className="text-sm text-muted-foreground mt-2">Your payment is awaiting verification from our team.</p>
                       )}
                       {order.paymentMethod === 'Cash on Delivery' && (
                           <p className="text-sm text-muted-foreground mt-2">Please prepare the total amount in cash for the delivery person.</p>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
         <div className="text-center mt-8">
            <Button asChild>
                <Link href="/profile">Back to My Orders</Link>
            </Button>
        </div>
    </div>
  );
}
