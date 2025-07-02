import { ProductForm } from "./product-form";

export default function NewProductPage() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <ProductForm initialData={null} />
      </div>
    </div>
  );
}
