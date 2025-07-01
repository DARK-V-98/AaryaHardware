import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageHint: string;
};

export function ProductCard({ name, description, price, imageUrl, imageHint }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl group">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">${price}</p>
        <Button variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  );
}
