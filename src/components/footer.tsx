import Image from "next/image";

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
                  <Image src="/facebook.png" alt="Facebook logo" width={20} height={20} className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
              </a>
              <a href="https://www.youtube.com/@setwemudaapinugegoda391" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Image src="/youtube.png" alt="YouTube logo" width={20} height={20} className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
              </a>
              <a href="https://www.instagram.com/Aaryahardware2019" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Image src="/instagram.png" alt="Instagram logo" width={20} height={20} className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@aaryahardware.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Image src="/tiktok.png" alt="TikTok logo" width={20} height={20} className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Image src="/whatsapp.png" alt="WhatsApp logo" width={20} height={20} className="h-5 w-5" />
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
