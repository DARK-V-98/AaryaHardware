export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageHint: string;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Waterfall Faucet",
    description: "Sleek chrome finish with a unique waterfall design.",
    price: "129.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "waterfall faucet",
    featured: true,
  },
  {
    id: "2",
    name: "Rainfall Shower Head",
    description: "Experience luxury with this 12-inch rainfall shower head.",
    price: "199.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "rainfall shower",
    featured: true,
  },
  {
    id: "3",
    name: "Vessel Sink & Pop-up Drain",
    description: "Elegant ceramic vessel sink for a contemporary look.",
    price: "249.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "vessel sink",
    featured: true,
  },
   {
    id: "4",
    name: "Minimalist Towel Rack",
    description: "Brushed nickel towel rack with a clean, simple design.",
    price: "79.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "towel rack",
    featured: true,
  },
  {
    id: "5",
    name: "Matte Black Toilet",
    description: "A sleek and modern matte black toilet for a bold statement.",
    price: "499.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "black toilet",
    featured: false,
  },
  {
    id: "6",
    name: "Freestanding Bathtub",
    description: "Luxurious freestanding bathtub for a spa-like experience.",
    price: "1299.99",
    imageUrl: "https://placehold.co/600x600.png",
    imageHint: "freestanding bathtub",
    featured: false,
  },
];
