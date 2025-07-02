
"use client";

import { DataTable } from "@/app/admin/products/components/data-table";
import { columns, OrderColumn } from "./columns";

interface HeadingProps {
  title: string;
  description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

interface OrdersClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrdersClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <DataTable searchKey="customer" columns={columns} data={data} />
    </>
  );
};
