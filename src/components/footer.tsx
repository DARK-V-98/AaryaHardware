import { Facebook, Instagram, Youtube } from "lucide-react";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}
    >
        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.924 9.924 0 0 0 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91a9.87 9.87 0 0 0-2.91-7.01zM12.04 20.15c-1.48 0-2.92-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24a8.193 8.193 0 0 1 8.24 8.24c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.27-.14-1.59-.78-1.84-.87-.24-.09-.43-.14-.61.14-.18.27-.69.87-.85 1.04-.15.17-.31.19-.58.06s-1.14-.42-2.17-1.34c-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.3.4-.41.13-.12.18-.21.27-.36.09-.15.04-.28-.02-.41-.07-.13-.61-1.47-.84-2.02-.23-.55-.46-.47-.62-.47-.15 0-.32-.02-.49-.02s-.44.06-.67.33c-.23.27-.88.85-.88 2.07s.9 2.4 1.03 2.56c.13.17 1.77 2.71 4.3 3.8.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.59-.65 1.81-1.28.22-.63.22-1.17.15-1.28-.07-.11-.24-.17-.51-.3z"/>
    </svg>
);


export function Footer() {
  const whatsappUrl = `https://wa.me/c/94782404099`;

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
            <a href="https://www.youtube.com/@setwemudaapinugegoda391" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
            </a>
            <a href="https://www.instagram.com/Aaryahardware2019" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
            </a>
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <WhatsAppIcon className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
