// lib/auth.ts
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  console.log('Initiating Google Sign-In...');
  try {
    // Thử đăng nhập bằng popup trước
    let result = await signInWithPopup(auth, googleProvider);
    return await processSignInResult(result);
  } catch (error: any) {
    console.error('Google Sign-In error:', error);

    // Xử lý các lỗi cụ thể
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.log('Falling back to redirect for Google Sign-In...');
      try {
        // Chuyển sang redirect
        await signInWithRedirect(auth, googleProvider);
        // Lưu ý: getRedirectResult sẽ được gọi ở nơi khác (xem phần xử lý redirect bên dưới)
        return null; // Trả về null để báo hiệu rằng quá trình redirect đang chờ
      } catch (redirectError: any) {
        throw new Error('Failed to initiate redirect: ' + redirectError.message);
      }
    }

    // Xử lý các lỗi Firebase khác
    throw handleFirebaseError(error);
  }
};

// Hàm xử lý kết quả đăng nhập (dùng cho cả popup và redirect)
const processSignInResult = async (result: any) => {
  if (!result) {
    throw new Error('No sign-in result received');
  }

  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential) {
    throw new Error('Failed to retrieve credentials');
  }
console.log('Google Sign-In successful:', credential);
console.log('Google Sign-In successful:', result.user);
console.log('Google Sign-In successful:', result.user.getIdToken(true));
  const accessToken = credential.accessToken;
  const idToken = await result.user.getIdToken(true);
  if (!idToken) {
    throw new Error('Failed to retrieve ID token');
  }

  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
    },
    accessToken,
  };
};

// Hàm xử lý lỗi Firebase
const handleFirebaseError = (error: AuthError) => {
  switch (error.code) {
    case 'auth/network-request-failed':
      return new Error('Network error. Please check your connection and try again.');
    case 'auth/too-many-requests':
      return new Error('Too many attempts. Please try again later.');
    case 'auth/user-cancelled':
      return new Error('Sign-in was cancelled by the user.');
    default:
      return new Error(error.message || 'Google Sign-In failed');
  }
};

// Hàm xử lý kết quả redirect (gọi khi trang tải lại sau redirect)
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return await processSignInResult(result);
    }
    return null; // Không có kết quả redirect
  } catch (error: any) {
    console.error('Redirect result error:', error);
    throw handleFirebaseError(error);
  }
};