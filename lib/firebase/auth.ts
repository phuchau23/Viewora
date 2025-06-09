import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  console.log('Initiating Google Sign-In...');
  try {
    let result = await signInWithPopup(auth, googleProvider);
    return await processSignInResult(result);
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Falling back to redirect...');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw new Error(error.message || 'Google Sign-In failed');
  }
};

const processSignInResult = async (result: any) => {
  if (!result) throw new Error('No sign-in result');
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential) throw new Error('No credential');
  const idToken = credential.idToken; // Lấy Google ID token
  if (!idToken) throw new Error('No Google ID token');
  console.log('Google ID token:', idToken);
  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName || '',
    },
  };
};

export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return await processSignInResult(result);
    }
    return null;
  } catch (error: any) {
    console.error('Redirect error:', error);
    throw new Error(error.message || 'Redirect login failed');
  }
};