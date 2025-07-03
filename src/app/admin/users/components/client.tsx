
"use client";

import { DataTable } from "@/app/admin/products/components/data-table";
import { columns, UserColumn } from "./columns";

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

interface UsersClientProps {
  data: UserColumn[];
}

export const UserClient: React.FC<UsersClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Users (${data.length})`}
        description="Manage user roles for your store"
      />
      <DataTable searchKey="email" columns={columns} data={data} />
    </>
  );
};
