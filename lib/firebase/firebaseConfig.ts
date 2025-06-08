// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAFgDKr1s7wOOoyidr8rgYNKe3SsvB4ShA",
  authDomain: "viewora-2025.firebaseapp.com",
  projectId: "viewora-2025",
  storageBucket: "viewora-2025.firebasestorage.app",
  messagingSenderId: "65057299219",
  appId: "1:65057299219:web:b2692c2d9d18ef787e18e6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);