
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem('cart');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.quantity < newQuantity) {
            toast({ title: 'Not enough stock', description: `Cannot add more than ${product.quantity} items to the cart.`, variant: 'destructive' });
            return;
        }
    } else {
        if (product.quantity < quantity) {
            toast({ title: 'Not enough stock', description: `Only ${product.quantity} items available.`, variant: 'destructive' });
            return;
        }
    }

    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.product.id === product.id);
      if (itemInCart) {
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    if (existingItem) {
        toast({ title: 'Item added to cart', description: `${product.name} quantity updated.` });
    } else {
        toast({ title: 'Item added to cart', description: `${quantity} x ${product.name} added.` });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({ title: 'Item removed from cart.' });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemToUpdate = cartItems.find(item => item.product.id === productId);
    
    if (itemToUpdate && quantity > itemToUpdate.product.quantity) {
        toast({ title: 'Not enough stock', description: `Only ${itemToUpdate.product.quantity} items available.`, variant: 'destructive' });
        return; // Prevent update
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          if (quantity <= 0) {
            return null;
          }
          return { ...item, quantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
