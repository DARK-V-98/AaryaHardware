
import { UserAuthGuard } from "@/components/user-auth-guard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
            <UserAuthGuard>
                {children}
            </UserAuthGuard>
        </main>
        <Footer />
    </div>
  );
}
