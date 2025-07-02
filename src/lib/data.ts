
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  imageHint: string;
  featured: boolean;
  categoryId: string;
  quantity: number;
  createdAt?: any;
  updatedAt?: any;
};

export type Category = {
  id: string;
  name: string;
  createdAt?: any;
  updatedAt?: any;
};


// Products are now fetched from Firestore.
// This file is kept for the type definition.
export const products: Product[] = [];
