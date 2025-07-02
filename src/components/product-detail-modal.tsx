
'use client';

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/data";

interface ProductDetailModalProps {
  product: Product;
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, categoryName, isOpen, onClose }: ProductDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-2">{product.name}</DialogTitle>
            </DialogHeader>
             <div className="flex items-center gap-4 my-2">
                 {product.discountPrice && product.discountPrice > 0 ? (
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl text-muted-foreground line-through">
                            LKR {product.price.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            LKR {product.discountPrice.toFixed(2)}
                        </p>
                    </div>
                ) : (
                    <p className="text-2xl font-bold text-primary">
                        LKR {product.price.toFixed(2)}
                    </p>
                )}
                <Badge variant="secondary">{categoryName}</Badge>
            </div>
            <DialogDescription className="text-base text-muted-foreground mt-4 flex-grow">
              {product.description}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
