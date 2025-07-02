export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  featured: boolean;
  createdAt?: any;
  updatedAt?: any;
};

// Products are now fetched from Firestore.
// This file is kept for the type definition.
export const products: Product[] = [];
