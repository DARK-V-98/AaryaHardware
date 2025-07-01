import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
