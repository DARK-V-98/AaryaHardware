
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const { cartItems, cartCount, removeFromCart, updateQuantity, subtotal } = useCart();
  const router = useRouter();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Open Cart</span>
          {cartCount > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
            <>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                <div className="flex flex-col gap-4">
                {cartItems.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                            <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                LKR {(item.product.discountPrice ?? item.product.price).toFixed(2)}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max={item.product.quantity}
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                                    className="h-8 w-16"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                    <span className="sr-only">Remove item</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            <Separator />
            <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                    <div className="flex justify-between font-semibold">
                        <span>Subtotal</span>
                        <span>LKR {subtotal.toFixed(2)}</span>
                    </div>
                    <SheetClose asChild>
                        <Button className="w-full" onClick={() => router.push('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </SheetClose>
                </div>
            </SheetFooter>
            </>
        ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add some products to get started.</p>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
