'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CartItem } from '@/types';
import { getCart, addToCart as addToCartFirestore, updateCartItem as updateCartItemFirestore, removeFromCart as removeFromCartFirestore } from '@/services/firestore';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    if (user) {
      try {
        const cart = await getCart(user.uid);
        if (cart) {
          setItems(cart.items);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Failed to load cart');
      }
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      setItems((prev) => {
        const existingItem = prev.find((i) => i.id === item.id);
        if (existingItem) {
          const updatedItems = prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
          if (user) {
            // Update Firebase
            updateCartItemFirestore(user.uid, item.id, existingItem.quantity + item.quantity)
              .catch((error) => {
                console.error('Error updating cart in Firebase:', error);
                toast.error('Failed to update cart');
              });
          }
          return updatedItems;
        }
        if (user) {
          // Add to Firebase
          addToCartFirestore(user.uid, item).catch((error) => {
            console.error('Error adding to cart in Firebase:', error);
            toast.error('Failed to add to cart');
          });
        }
        return [...prev, item];
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      if (user) {
        await updateCartItemFirestore(user.uid, itemId, quantity);
      }
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user) {
        await removeFromCartFirestore(user.uid, itemId);
      }
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
      throw error;
    }
  };

  const clearCart = async () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 