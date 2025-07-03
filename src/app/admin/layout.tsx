
import { AdminNav } from "@/components/admin-nav";
import { AuthGuard } from "@/components/auth-guard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
            <AuthGuard>
                <div className="flex flex-col md:flex-row md:gap-6">
                    <AdminNav />
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </AuthGuard>
        </main>
        <Footer />
    </div>
  );
}
