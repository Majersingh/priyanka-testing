'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, updateCartItem, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      router.push('/signin');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-600">Add some products to your cart to see them here.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-4"
              >
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg w-full sm:w-[100px] h-[100px] object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:space-x-4">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateCartItem(item.id, parseInt(e.target.value))}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <p className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
} 