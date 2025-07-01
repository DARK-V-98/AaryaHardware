import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Modern Waterfall Faucet",
    description: "Sleek chrome finish with a unique waterfall design.",
    price: "129.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "waterfall faucet",
  },
  {
    id: 2,
    name: "Rainfall Shower Head",
    description: "Experience luxury with this 12-inch rainfall shower head.",
    price: "199.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "rainfall shower",
  },
  {
    id: 3,
    name: "Vessel Sink & Pop-up Drain",
    description: "Elegant ceramic vessel sink for a contemporary look.",
    price: "249.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "vessel sink",
  },
   {
    id: 4,
    name: "Minimalist Towel Rack",
    description: "Brushed nickel towel rack with a clean, simple design.",
    price: "79.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "towel rack",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="/arb.jpg"
            alt="Beautiful bathroom scene"
            fill
            className="object-cover"
            data-ai-hint="elegant bathroom"
            priority
          />
          <div className="relative z-20 container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight drop-shadow-lg">
              Elegance in Every Detail
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Discover our premium collection of hardware that combines modern design with timeless quality.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <a href="#products">Shop Collection</a>
            </Button>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="about" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">About Aarya Hardware</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aarya Hardware is a premier destination for high-quality, design-forward hardware and accessories. We believe that every space should be both functional and beautiful. That's why we meticulously source and curate a collection of products that embody elegance, innovation, and durability. Our mission is to help you create a space that is not only functional but also a true reflection of your personal style.
              </p>
            </div>
             <div className="order-1 md:order-2">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Stylish faucet detail"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover"
                    data-ai-hint="stylish faucet"
                />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">Get In Touch</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-12">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold">Our Showroom</h3>
                <p className="text-muted-foreground">
                  Visit us to experience our collection firsthand. Our team is ready to assist you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">123 Hardware Avenue, Suite 100<br/>Aqua City, State 12345</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">(123) 456-7890</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
