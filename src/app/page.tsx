'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState, useRef } from 'react';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaTruck, FaShieldAlt, FaHeadset, FaShoppingCart, FaTrash } from 'react-icons/fa';

// FAQ data
const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, UPI, and net banking. All payments are processed securely through our payment partners."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery in select areas."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in their original packaging. Returns are free with our prepaid shipping label."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
  }
];

// Reviews data
const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Amazing quality products and excellent customer service. Will definitely shop again!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 5,
    comment: "Fast delivery and great prices. The product quality exceeded my expectations.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Anjali Patel",
    rating: 5,
    comment: "Best shopping experience ever! The variety of products is amazing.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  }
];

// Features data
const features = [
  {
    icon: <FaTruck className="w-8 h-8" />,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to your doorstep"
  },
  {
    icon: <FaShieldAlt className="w-8 h-8" />,
    title: "Secure Payment",
    description: "100% secure payment processing"
  },
  {
    icon: <FaHeadset className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Round-the-clock customer support"
  }
];

export default function Home() {
  const { addToCart, removeFromCart, items } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const productRef = useRef(null);
  const categoryRef = useRef(null);
  const isProductInView = useInView(productRef, { once: true, margin: "-100px" });
  const isCategoryInView = useInView(categoryRef, { once: true, margin: "-100px" });

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
    } finally {
      setIsLoading(null);
    }
  };

  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Priyanka E-commerce</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link
            href="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section ref={categoryRef}>
        <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isCategoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group relative h-64 rounded-lg overflow-hidden"
            >
              <Link href={`/categories/${category.slug}`}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 group-hover:text-white transition-colors duration-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productRef}>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => {
            const isInCart = items.some(item => item.id === product.id);
            const cartItem = items.find(item => item.id === product.id);
            
            return (
              <Link href={`/products/${product.id}`}>
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isProductInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {isInCart && (
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                        In Cart
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">₹{product.price.toFixed(2)}</p>
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveFromCart(product.id);
                            }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleViewCart();
                            }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleBuyNow(product);
                          }}
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
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <FaQuoteLeft className="text-primary mb-2" />
                <p className="text-gray-600">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <span className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-4 border-t"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 