// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDtNbKkvKTSpqiuPsbuY4EkNmvI9X0QaE",
  authDomain: "viewora-bb11a.firebaseapp.com",
  projectId: "viewora-bb11a",
  storageBucket: "viewora-bb11a.firebasestorage.app",
  messagingSenderId: "148914899812",
  appId: "1:148914899812:web:551e571f3828e2cd89c871",
  measurementId: "G-FGY25ZW2D6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);