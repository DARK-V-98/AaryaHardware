
'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { runTransaction, doc, collection, serverTimestamp } from 'firebase/firestore';

import { firestore } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
});

type ShippingFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartCount, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
    },
  });

  const onSubmit = async (data: ShippingFormValues) => {
    if (cartCount === 0) {
        toast({ title: 'Your cart is empty', description: 'Please add items to your cart before checking out.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    
    const newOrderRef = doc(collection(firestore, "orders"));

    try {
        await runTransaction(firestore, async (transaction) => {
            const productUpdates: { ref: any; newQuantity: number }[] = [];

            for (const item of cartItems) {
                const productRef = doc(firestore, 'products', item.product.id);
                const productDoc = await transaction.get(productRef);

                if (!productDoc.exists()) {
                    throw new Error(`Product ${item.product.name} is no longer available.`);
                }
                const currentQuantity = productDoc.data().quantity;
                if (currentQuantity < item.quantity) {
                    throw new Error(`Not enough stock for ${item.product.name}. Only ${currentQuantity} available.`);
                }
                const newQuantity = currentQuantity - item.quantity;
                productUpdates.push({ ref: productRef, newQuantity });
            }

            // If we are here, all stock checks passed. Now write all updates.
            productUpdates.forEach(update => {
                transaction.update(update.ref, { quantity: update.newQuantity });
            });

            const orderData = {
                userId: user?.uid || null,
                shippingAddress: data,
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.discountPrice ?? item.product.price,
                    quantity: item.quantity,
                    imageUrl: item.product.imageUrl,
                })),
                totalAmount: subtotal,
                status: 'Pending Payment',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            transaction.set(newOrderRef, orderData);
        });

        // If transaction succeeds:
        clearCart();
        toast({ title: 'Order Placed!', description: 'Your order has been successfully placed.' });
        router.push(`/order-confirmation/${newOrderRef.id}`);

    } catch (error: any) {
        console.error("Checkout error:", error);
        toast({ title: 'Order Failed', description: error.message, variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="addressLine1" render={({ field }) => (
                                        <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name="addressLine2" render={({ field }) => (
                                        <FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="city" render={({ field }) => (
                                            <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                                            <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <Button type="submit" className="w-full" size="lg" disabled={loading || cartCount === 0}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Place Order
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                           <CardTitle>Order Summary</CardTitle>
                           <CardDescription>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {cartItems.length > 0 ? (
                                <div className="space-y-4">
                                    {cartItems.map(item => (
                                        <div key={item.product.id} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">LKR {( (item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>LKR {subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                             ) : (
                                <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  )
}
