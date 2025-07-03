
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  discountPrice?: string;
  category: string;
  featured: boolean;
  quantity: number;
  imageUrl: string;
  additionalImageUrls?: string[];
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
   {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const { price, discountPrice } = row.original;
      const hasDiscount = discountPrice && parseFloat(discountPrice) > 0;
      return (
        <div>
          {hasDiscount ? (
            <>
              <span className="line-through text-muted-foreground">LKR {price}</span>
              <br />
              <span className="text-primary font-bold">LKR {discountPrice}</span>
            </>
          ) : (
            `LKR ${price}`
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge>
            <Check className="mr-2 h-4 w-4" />
            Yes
        </Badge>
      ) : (
        <Badge variant="secondary">
            <X className="mr-2 h-4 w-4" />
            No
        </Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
