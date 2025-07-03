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

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.16-4.2-1.8-6.45.36-2.25 1.98-4.15 4.1-4.75.14-.04.28-.09.42-.12.1-.02.2-.05.3-.07.03-.01.07-.01.1-.02h.01c.02.01.04.01.06.01.2.02.4.03.6.04 1.1.06 2.21.16 3.29.31.01-.01.02-.02.03-.03v-4.68c-.81-.23-1.62-.4-2.4-.56-1.15-.24-2.26-.56-3.32-1.03-1.06-.48-2.04-1.13-2.8-2-.84-.96-1.31-2.12-1.29-3.35.02-1.22.49-2.38 1.3-3.31 1.25-1.44 3.06-2.34 4.96-2.34 1.79 0 3.51.78 4.74 2.05.13.13.25.26.37.4.24-.13.47-.26.7-.39.29-.16.59-.3.9-.42.29-.11.59-.2.88-.29z"/>
    </svg>
);


export function Footer() {
  const whatsappUrl = `https://wa.me/c/94782404099`;

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
            © {new Date().getFullYear()} Aarya Bathware. All rights reserved.
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
              <a href="https://www.tiktok.com/@aaryahardware.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <TikTokIcon className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <WhatsAppIcon className="h-5 w-5" />
                  <span className="sr-only">WhatsApp</span>
              </a>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-6 pt-4 border-t border-border/50">
          <a href="https://www.esystemlk.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Powered by esystemlk
          </a>
        </div>
      </div>
    </footer>
  );
}
