// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config goes here 👇
const firebaseConfig = {
  apiKey: "AIzaSyAzwUmQqf86yX_fqUpUVqEpBAvtfZMLPTg",
  authDomain: "nilemarket.firebaseapp.com",
  projectId: "nilemarket",
  storageBucket: "nilemarket.firebasestorage.app",
  messagingSenderId: "691937117786",
  appId: "1:691937117786:web:7b7cfb4d0c8aeb341c3a63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services you’ll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
