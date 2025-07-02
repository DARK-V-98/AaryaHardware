import { Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
          © {new Date().getFullYear()} Aarya Hardware. All rights reserved.
        </p>
        <div className="flex items-center gap-4 order-1 sm:order-2">
            <a href="https://www.facebook.com/profile.php?id=61550646628658" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
