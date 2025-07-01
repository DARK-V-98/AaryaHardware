"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  featured: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `LKR ${row.original.price}`,
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
