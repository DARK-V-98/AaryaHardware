
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Order } from '@/lib/data';
import { Loader2, CheckCircle, Banknote, Copy, Truck, ExternalLink, XCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelAlertOpen, setCancelAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.orderId) {
        setLoading(false);
        return;
      };
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

  const handleCancelOrder = async () => {
    if (!order) return;
    setIsCancelling(true);

    try {
        await runTransaction(firestore, async (transaction) => {
            const orderRef = doc(firestore, 'orders', order.id);
            const orderDoc = await transaction.get(orderRef);

            if (!orderDoc.exists() || orderDoc.data().status !== 'Pending Payment' && orderDoc.data().status !== 'Processing') {
                throw new Error("Order can no longer be cancelled.");
            }

            for (const item of order.items) {
                const productRef = doc(firestore, 'products', item.productId);
                const productDoc = await transaction.get(productRef);
                if (productDoc.exists()) {
                    const currentQuantity = productDoc.data().quantity;
                    transaction.update(productRef, { quantity: currentQuantity + item.quantity });
                }
            }
            
            transaction.update(orderRef, {
                status: 'Cancelled',
                updatedAt: serverTimestamp(),
            });
        });
        
        toast({ title: 'Order Cancelled', description: 'Your order has been successfully cancelled.' });
        setOrder(prev => prev ? { ...prev, status: 'Cancelled' } : null);

    } catch (error: any) {
        console.error('Error cancelling order:', error);
        toast({ title: 'Error', description: 'Failed to cancel order: ' + error.message, variant: 'destructive' });
    } finally {
        setIsCancelling(false);
        setCancelAlertOpen(false);
    }
  };

  const whatsappNumber = "94782404099";
  const getWhatsappMessage = () => {
    if (!order) return "";
    if (order.paymentMethod === 'Bank Transfer') {
        return encodeURIComponent(`Hi, I've made a bank transfer for Order ID: ${order.id}. Please find the receipt attached.`);
    } else {
        return encodeURIComponent(`Hi, please confirm my Cash on Delivery order. Order ID: ${order.id}. Thank you.`);
    }
  }
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsappMessage()}`;


  if (loading) {
    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </main>
            <Footer />
        </div>
    )
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

  const isCancellable = order.status === 'Pending Payment' || order.status === 'Processing';

  return (
    <>
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} disabled={isCancelling} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col min-h-dvh bg-background">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-16">
              <Card className="max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                      {order.status === 'Cancelled' ? (
                          <>
                              <XCircle className="mx-auto h-12 w-12 text-destructive"/>
                              <CardTitle className="text-3xl mt-4">Order Cancelled</CardTitle>
                              <CardDescription>Your order has been successfully cancelled.</CardDescription>
                          </>
                      ) : (
                          <>
                              <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                              <CardTitle className="text-3xl mt-4">Thank You for Your Order!</CardTitle>
                              <CardDescription>
                                  Your order has been placed. Please follow the instructions below to complete your payment and confirm your order.
                              </CardDescription>
                          </>
                      )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="text-center p-4 bg-secondary rounded-md">
                          <p className="text-sm text-muted-foreground">Your Order ID</p>
                          <p className="text-2xl font-bold tracking-widest">{order.id}</p>
                      </div>

                      <Separator />
                      
                      {order.status !== 'Cancelled' && (
                        <>
                           <Alert className="bg-green-50 border-green-200">
                                <AlertTitle className="text-green-800 font-bold">Action Required: Confirm Your Order</AlertTitle>
                                <AlertDescription className="text-green-700 space-y-3">
                                    <p>Please confirm your order by contacting us on WhatsApp. This is required for us to start processing it.</p>
                                    <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            Confirm via WhatsApp
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                             <Separator />
                        </>
                      )}

                      
                      {order.paymentMethod === 'Bank Transfer' ? (
                          <div className="space-y-4">
                              <h3 className="font-semibold text-lg flex items-center gap-2"><Banknote/> Bank Transfer Details</h3>
                              <p className="text-muted-foreground">Please transfer the total amount to the account below. Use your Order ID as the payment reference and send the receipt via WhatsApp.</p>
                              <div className="p-4 border rounded-md space-y-3">
                                  <div className="flex justify-between items-center">
                                      <div><span className="font-medium">Account Name:</span> Aarya Hardware</div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <div><span className="font-medium">Bank Name:</span> NDB Bank</div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <div><span className="font-medium">Account Number:</span> 111000268395</div>
                                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard('111000268395', 'Account Number')}><Copy className="h-4 w-4"/></Button>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <div><span className="font-medium">Branch:</span> PItakotte</div>
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
                      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                        {isCancellable && (
                            <Button variant="destructive" className="w-full" onClick={() => setCancelAlertOpen(true)} disabled={isCancelling}>
                                {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cancel Order'}
                            </Button>
                        )}
                        <Button asChild className="w-full">
                           <Link href="/products">Continue Shopping</Link>
                       </Button>
                      </div>
                  </CardContent>
              </Card>
          </main>
          <Footer />
      </div>
    </>
  )
}
