
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/lib/data";

export function ProductCard(product: Product) {
  const isOutOfStock = product.quantity === 0;

  return (
    <Card className="glass-effect flex flex-col overflow-hidden transition-shadow hover:shadow-2xl group h-full">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
           {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">Out of Stock</span>
            </div>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
            data-ai-hint={product.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1 flex-grow">{product.name}</h3>
        {product.discountPrice && product.discountPrice > 0 ? (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground line-through">
              LKR {product.price.toFixed(2)}
            </p>
            <p className="text-lg font-bold text-primary">
              LKR {product.discountPrice.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-lg font-bold text-primary mt-2">LKR {product.price.toFixed(2)}</p>
        )}
      </CardContent>
    </Card>
  );
}
