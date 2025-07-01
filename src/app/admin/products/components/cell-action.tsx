"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { ProductColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { toast } = useToast();

  const onEdit = () => {
    // For now, this is a placeholder. In a real app, you'd navigate to an edit page.
    // e.g., router.push(`/admin/products/${data.id}`);
    console.log("Edit product:", data);
    toast({ title: "Edit Clicked", description: `This would open an edit form for ${data.name}.` });
  };
  
  const onDelete = () => {
    // For now, this is a placeholder. In a real app, you'd show a confirmation modal
    // and then make an API call to delete the product.
    console.log("Delete product:", data);
    toast({ title: "Delete Clicked", description: `${data.name} would be deleted.`, variant: "destructive" });
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
