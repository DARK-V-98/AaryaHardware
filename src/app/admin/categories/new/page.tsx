
import { CategoryForm } from "./category-form";

export default function NewCategoryPage() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoryForm initialData={null} />
      </div>
    </div>
  );
}
