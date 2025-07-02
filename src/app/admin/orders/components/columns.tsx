
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/data";

export type OrderColumn = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  createdAt: string;
};

const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Pending Payment':
            return 'secondary';
        case 'Processing':
        case 'Shipped':
        case 'Completed':
            return 'default';
        case 'Cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "items",
    header: "Items",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status as Order['status'])} className="capitalize">
            {row.original.status}
        </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
