
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/lib/data";

export type UserColumn = {
  id: string;
  email: string;
  role: UserData['role'];
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
        <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
            {row.original.role}
        </Badge>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
