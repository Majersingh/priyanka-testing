export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    stock: 10
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    stock: 15
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    category: 'Fashion',
    stock: 20
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with timer',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1517663154410-3e981d7e1e07?w=800&auto=format&fit=crop&q=60',
    category: 'Home & Living',
    stock: 8
  },
  {
    id: '5',
    name: 'Laptop',
    description: 'High-performance laptop for work and gaming',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    stock: 12
  },
  {
    id: '6',
    name: 'Designer Bag',
    description: 'Elegant designer handbag',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
    category: 'Fashion',
    stock: 15
  },
  {
    id: '7',
    name: 'Smart TV',
    description: '4K Ultra HD Smart TV with streaming capabilities',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    stock: 5
  },
  {
    id: '8',
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
    category: 'Sports',
    stock: 30
  }
]; 