
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
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
  subtotal: number;
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
    let toastTitle = 'Item added to cart';
    let toastDescription = `${quantity} x ${product.name} added.`;

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.quantity < newQuantity) {
            toast({ title: 'Not enough stock', description: `Cannot add more than ${product.quantity} items to the cart.`, variant: 'destructive' });
            return;
        }
        toastDescription = `${product.name} quantity updated.`;
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
    
    toast({ title: toastTitle, description: toastDescription });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({ title: 'Item removed from cart.' });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemToUpdate = cartItems.find(item => item.product.id === productId);
    
    if (itemToUpdate && quantity > itemToUpdate.product.quantity) {
        toast({ title: 'Not enough stock', description: `Only ${itemToUpdate.product.quantity} items available.`, variant: 'destructive' });
        return;
    }

    setCartItems(prevItems => {
        if (quantity <= 0) {
            return prevItems.filter(item => item.product.id !== productId);
        }
        return prevItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);
  
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0), [cartItems]);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal }}>
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
