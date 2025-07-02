
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Order } from '@/lib/data';
import { Loader2, CheckCircle, Banknote, Copy, Truck } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.orderId) return;
      try {
        const docRef = doc(firestore, 'orders', params.orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.orderId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${field} copied to clipboard.` });
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  if (!order) {
    return (
         <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-2xl font-bold">Order Not Found</h1>
                <p className="mt-2 text-muted-foreground">We couldn't find an order with that ID.</p>
                <Button asChild className="mt-6">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                    <CardTitle className="text-3xl mt-4">Thank You for Your Order!</CardTitle>
                    <CardDescription>
                        {order.paymentMethod === 'Bank Transfer' 
                            ? 'Your order has been placed. Please follow the instructions below to complete your payment.'
                            : 'Your order has been placed and will be processed shortly.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-secondary rounded-md">
                        <p className="text-sm text-muted-foreground">Your Order ID</p>
                        <p className="text-2xl font-bold tracking-widest">{order.id}</p>
                    </div>

                    <Separator />
                    
                    {order.paymentMethod === 'Bank Transfer' ? (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Banknote/> Bank Transfer Details</h3>
                            <p className="text-muted-foreground">Please transfer the total amount to the account below. Use your Order ID as the payment reference.</p>
                            <div className="p-4 border rounded-md space-y-3">
                                <div className="flex justify-between items-center">
                                    <div><span className="font-medium">Account Name:</span> Aarya Hardware</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div><span className="font-medium">Bank Name:</span> Commercial Bank</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div><span className="font-medium">Account Number:</span> 123456789012</div>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('123456789012', 'Account Number')}><Copy className="h-4 w-4"/></Button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div><span className="font-medium">Branch:</span> Colombo 07</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Truck/> Cash on Delivery</h3>
                            <p className="text-muted-foreground">Your order is confirmed. Please prepare the total amount in cash to be paid upon delivery. Our team will contact you before dispatch.</p>
                        </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                        <h3 className="font-semibold">Order Summary</h3>
                        {order.items.map(item => (
                            <div key={item.productId} className="flex justify-between text-muted-foreground">
                                <p>{item.name} x {item.quantity}</p>
                                <p>LKR {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                         <Separator className="my-2"/>
                         <div className="flex justify-between font-bold text-xl">
                            <p>Total Amount</p>
                            <p>LKR {order.totalAmount.toFixed(2)}</p>
                         </div>
                    </div>
                     <Button asChild className="w-full mt-6">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
        <Footer />
    </div>
  )
}
