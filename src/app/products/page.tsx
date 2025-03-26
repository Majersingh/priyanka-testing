'use client';

import { products } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState, useRef } from 'react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

export default function ProductsPage() {
  const { addToCart, removeFromCart, items } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const productRef = useRef(null);
  const isProductInView = useInView(productRef, { once: true, margin: "-100px" });

  const handleAddToCart = async (product: typeof products[0]) => {
    try {
      setIsLoading(product.id);
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(null);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      setIsLoading(productId);
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    } finally {
      setIsLoading(null);
    }
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  const handleBuyNow = async (product: typeof products[0]) => {
    if (!user) {
      toast.error('Please sign in to proceed with purchase');
      router.push('/signin');
      return;
    }
    try {
      setIsLoading(product.id);
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to proceed with purchase');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div ref={productRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const isInCart = items.some(item => item.id === product.id);
          const cartItem = items.find(item => item.id === product.id);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isProductInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {isInCart && (
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                      In Cart
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{product.name}</h2>
                </Link>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-primary font-bold mb-4">₹{product.price.toFixed(2)}</p>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                  {isInCart ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Quantity: {cartItem?.quantity}</span>
                        <span>Total: ₹{(product.price * (cartItem?.quantity || 1)).toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRemoveFromCart(product.id)}
                          disabled={isLoading === product.id}
                          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading === product.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <FaTrash />
                              Remove
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleViewCart}
                          className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart />
                          View Cart
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(product)}
                        disabled={isLoading === product.id}
                        className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading === product.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                          />
                        ) : (
                          'Add to Cart'
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBuyNow(product)}
                        disabled={isLoading === product.id}
                        className="flex-1 bg-secondary text-white py-2 rounded hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading === product.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                          />
                        ) : (
                          'Buy Now'
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 