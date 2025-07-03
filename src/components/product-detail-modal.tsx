
'use client';

import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/lib/data";
import { useCart } from "@/context/cart-context";
import { ShoppingCart } from "lucide-react";

interface ProductDetailModalProps {
  product: Product;
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, categoryName, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
     if (!value || value < 1) {
      setQuantity(1);
      return;
    }
    if (value > product.quantity) {
        setQuantity(product.quantity);
        return;
    }
    setQuantity(value);
  }

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-3xl max-h-[90dvh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="relative aspect-square">
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-md">
                <span className="text-white font-bold text-xl tracking-wider">Out of Stock</span>
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={`object-cover rounded-md ${isOutOfStock ? 'grayscale' : ''}`}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold">{product.name}</DialogTitle>
              <Badge variant="secondary" className="w-fit">{categoryName}</Badge>
            </DialogHeader>
             
            <div className="flex items-baseline gap-2">
                {product.discountPrice && product.discountPrice > 0 ? (
                <div className="flex items-baseline gap-2">
                    <p className="text-xl text-muted-foreground line-through">
                        LKR {product.price.toFixed(2)}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                        LKR {product.discountPrice.toFixed(2)}
                    </p>
                </div>
                ) : (
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                        LKR {product.price.toFixed(2)}
                    </p>
                )}
            </div>
            
            <DialogDescription className="text-base text-muted-foreground flex-grow">
              {product.description}
            </DialogDescription>

            <div className="flex items-center gap-2">
                 <p className="text-sm font-medium">Stock:</p>
                 <p className={`text-sm font-bold ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${product.quantity} available`}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto pt-4">
              <div className="flex items-center gap-2">
                  <Label htmlFor="quantity" className="sr-only">Quantity</Label>
                  <Input 
                    id="quantity"
                    type="number" 
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="h-10 w-20"
                    disabled={isOutOfStock}
                  />
              </div>
              <Button onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
