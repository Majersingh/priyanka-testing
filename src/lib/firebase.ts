import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5Zm6oSHWCLZaf_J2uuPcTdU6TiPKthPA",
  authDomain: "my-firebase-db07.firebaseapp.com",
  databaseURL: "https://my-firebase-db07-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-firebase-db07",
  storageBucket: "my-firebase-db07.firebasestorage.app",
  messagingSenderId: "452532910623",
  appId: "1:452532910623:web:4a0009b67328f28667b32a",
  measurementId: "G-TYSJV1R9HE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const database = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, database, auth }; 