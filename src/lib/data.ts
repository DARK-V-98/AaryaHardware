
export type Product = {
  id: string;
  name: string;
  name_si?: string;
  description: string;
  description_si?: string;
  price: number;
  discountPrice?: number | null;
  imageUrl: string;
  additionalImageUrls?: string[];
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

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type ShippingAddress = {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
};

export type PaymentMethod = 'Bank Transfer' | 'Cash on Delivery';

export type OrderStatus = 'Pending Payment' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export type Order = {
  id: string;
  userId?: string | null;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  createdAt: any;
  updatedAt: any;
};

export type UserData = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
};


// Data is now fetched from Firestore.
// This file is kept for the type definitions.
export const products: Product[] = [];
