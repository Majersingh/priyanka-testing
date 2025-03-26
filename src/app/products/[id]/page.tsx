'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Product not found</h1>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please sign in to proceed with purchase');
      router.push('/signin');
      return;
    }
    try {
      setIsLoading(true);
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[400px] md:h-[600px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} />
              ))}
            </div>
            <span className="text-gray-600">(4.5 / 5)</span>
          </div>
          
          <p className="text-2xl font-bold text-primary mb-4">
            ₹{product.price}
          </p>
          
          <p className="text-gray-600 mb-6">
            {product.description}
          </p>
          
          <div className="flex sm:flex-row flex-col items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:text-primary"
                disabled={isLoading}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-2 text-gray-600 hover:text-primary"
                disabled={isLoading}
              >
                +
              </button>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <p className=' flex items-center gap-2  text-sm'>
                    <FaShoppingCart />
                    Add to Cart
                  </p>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={isLoading}
                className="flex items-center gap-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Buy Now'
                )}
              </motion.button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Stock:</span> {product.stock} units</p>
              <p><span className="font-medium">SKU:</span> PRD-{product.id}</p>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <p className="text-gray-600">
              Free shipping on orders over ₹500. Standard delivery takes 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 