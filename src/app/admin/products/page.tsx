import { products } from "@/lib/data";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

export default function ProductsPage() {
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    featured: item.featured,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
