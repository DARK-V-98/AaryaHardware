
'use client';

import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { runTransaction, doc, collection, serverTimestamp, getDoc } from 'firebase/firestore';

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
import { Loader2, Banknote, Truck } from 'lucide-react';
import Image from 'next/image';
import { Order, PaymentMethod } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  paymentMethod: z.enum(['Bank Transfer', 'Cash on Delivery'], {
    required_error: "You need to select a payment method."
  }),
});

type ShippingFormValues = z.infer<typeof formSchema>;


const generateOrderId = async (): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let isUnique = false;
    let orderId = '';

    while (!isUnique) {
        let result = '';
        for (let i = 0; i < 2; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        for (let i = 0; i < 5; i++) {
            result += nums.charAt(Math.floor(Math.random() * nums.length));
        }
        
        const docRef = doc(firestore, 'orders', result);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            isUnique = true;
            orderId = result;
        }
    }
    return orderId;
};

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
      paymentMethod: 'Bank Transfer'
    },
  });

  const onSubmit = async (data: ShippingFormValues) => {
    if (cartCount === 0) {
        toast({ title: 'Your cart is empty', description: 'Please add items to your cart before checking out.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    
    try {
        const orderId = await generateOrderId();
        const newOrderRef = doc(firestore, "orders", orderId);
        const status: Order['status'] = data.paymentMethod === 'Bank Transfer' ? 'Pending Payment' : 'Processing';

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

            productUpdates.forEach(update => {
                transaction.update(update.ref, { quantity: update.newQuantity });
            });

            const { paymentMethod, ...shippingAddress } = data;

            const orderData = {
                userId: user?.uid || null,
                shippingAddress,
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.discountPrice ?? item.product.price,
                    quantity: item.quantity,
                    imageUrl: item.product.imageUrl,
                })),
                totalAmount: subtotal,
                status,
                paymentMethod,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            transaction.set(newOrderRef, orderData);
        });

        clearCart();
        toast({ title: 'Order Placed!', description: 'Your order has been successfully placed.' });
        router.push(`/order-confirmation/${orderId}`);

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
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-12">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-4"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value="Bank Transfer" />
                                                </FormControl>
                                                <Banknote className="h-6 w-6 text-muted-foreground"/>
                                                <div className="flex-1">
                                                    <FormLabel className="font-normal text-base">
                                                    Bank Transfer
                                                    </FormLabel>
                                                    <p className="text-xs text-muted-foreground">Pay securely via bank transfer. Details provided after checkout.</p>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value="Cash on Delivery" />
                                                </FormControl>
                                                 <Truck className="h-6 w-6 text-muted-foreground"/>
                                                <div className="flex-1">
                                                    <FormLabel className="font-normal text-base">
                                                    Cash on Delivery
                                                    </FormLabel>
                                                     <p className="text-xs text-muted-foreground">Pay with cash when your order arrives at your doorstep.</p>
                                                </div>
                                            </FormItem>
                                        </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
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
                        <Button type="submit" className="w-full" size="lg" disabled={loading || cartCount === 0}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Place Order
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
        <Footer />
    </div>
  )
}
