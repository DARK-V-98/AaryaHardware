
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/lib/data";

export function ProductCard(product: Product) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl group h-full">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-semibold mb-1 flex-grow">{product.name}</CardTitle>
        <p className="text-lg font-bold text-primary mt-2">LKR {product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
