import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { database } from '@/lib/firebase';
import type { Product, Category, CartItem, Order, UserProfile } from '@/types';

interface CartDocument {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Products
export const getProducts = async (lastDoc?: any, limitCount: number = 12) => {
  let q = query(
    collection(database, 'products'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(
      collection(database, 'products'),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  return {
    products,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const getProductById = async (id: string) => {
  const docRef = doc(database, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const getProductsByCategory = async (category: string) => {
  const q = query(
    collection(database, 'products'),
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

// Categories
export const getCategories = async () => {
  const snapshot = await getDocs(collection(database, 'categories'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

export const getCategoryBySlug = async (slug: string) => {
  const q = query(collection(database, 'categories'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Category;
  }
  return null;
};

// Cart
export const getCart = async (userId: string) => {
  const q = query(collection(database, 'carts'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CartDocument;
  }
  return null;
};

export const addToCart = async (userId: string, item: CartItem) => {
  const cartRef = collection(database, 'carts');
  const cartDoc = await getCart(userId);

  if (cartDoc) {
    const items = [...cartDoc.items, item];
    await updateDoc(doc(database, 'carts', cartDoc.id), {
      items,
      updatedAt: Timestamp.now(),
    });
  } else {
    await addDoc(cartRef, {
      userId,
      items: [item],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  const cartDoc = await getCart(userId);
  if (cartDoc) {
    const items = cartDoc.items.map((item: CartItem) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    await updateDoc(doc(database, 'carts', cartDoc.id), {
      items,
      updatedAt: Timestamp.now(),
    });
  }
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const cartDoc = await getCart(userId);
  if (cartDoc) {
    const items = cartDoc.items.filter((item: CartItem) => item.id !== itemId);
    await updateDoc(doc(database, 'carts', cartDoc.id), {
      items,
      updatedAt: Timestamp.now(),
    });
  }
};

// Orders
export const createOrder = async (order: Omit<Order, 'id'>) => {
  const docRef = await addDoc(collection(database, 'orders'), {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: docRef.id, ...order } as Order;
};

export const getOrders = async (userId: string) => {
  const q = query(
    collection(database, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

export const getOrderById = async (id: string) => {
  const docRef = doc(database, 'orders', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  return null;
};

// User Profile
export const getUserProfile = async (userId: string) => {
  const docRef = doc(database, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const docRef = doc(database, 'users', userId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}; 