// lib/auth.ts
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email'); // Yêu cầu quyền email
facebookProvider.addScope('public_profile'); // Đảm bảo quyền cơ bản

export const signInWithGoogle = async () => {
  console.log("Attempting Google Sign-In...");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google Sign-In successful, redirect URI:", result);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
  } catch (error: any) {
    console.error("Google Sign-In error:", error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Falling back to redirect for Google');
      await signInWithRedirect(auth, googleProvider);
      const result = await getRedirectResult(auth);
      if (result) {
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
      }
      throw new Error('Redirect login failed');
    }
    throw new Error(error.message || 'Google Sign-In failed');
  }
};

export const signInWithFacebook = async () => {
  console.log("Attempting Facebook Sign-In...");
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("Facebook Sign-In successful, redirect URI:", result);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
  } catch (error: any) {
    console.error("Facebook Sign-In error:", error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Falling back to redirect for Facebook');
      await signInWithRedirect(auth, facebookProvider);
      const result = await getRedirectResult(auth);
      if (result) {
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
      }
      throw new Error('Redirect login failed');
    }
    throw new Error(error.message || 'Facebook Sign-In failed');
  }
};