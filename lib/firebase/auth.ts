import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebaseConfig';
// Khởi tạo auth và Google provider
const googleProvider = new GoogleAuthProvider();

// Hàm đăng nhập với Google (hỗ trợ cả popup và redirect)
export const signInWithGoogle = async () => {
  try {
    // Thử đăng nhập bằng popup
    const result = await signInWithPopup(auth, googleProvider);
    return await processSignInResult(result);
  } catch (error: any) {
    // Fallback sang redirect nếu popup bị chặn hoặc bị đóng
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    // Xử lý lỗi chi tiết
    throw new Error(formatErrorMessage(error));
  }
};

// Hàm xử lý kết quả đăng nhập
const processSignInResult = async (result: any) => {
  if (!result) {
    throw new Error('No sign-in result');
  }

  // Lấy credential và access token
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential) {
    throw new Error('No credential');
  }

  const idToken = await result.user.getIdToken();
  // Lấy thông tin bổ sung (IdP data)
  console.log(idToken)
  const additionalUserInfo = getAdditionalUserInfo(result);

  // Trả về thông tin người dùng và token
  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || '',
    },
    additionalUserInfo: additionalUserInfo || null, // Thông tin bổ sung từ IdP
  };
};

// Hàm xử lý kết quả redirect
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return await processSignInResult(result);
    }
    return null;
  } catch (error: any) {
    throw new Error(formatErrorMessage(error));
  }
};

// Hàm format lỗi để trả về thông tin chi tiết
const formatErrorMessage = (error: any) => {
  const errorCode = error.code || 'unknown';
  const errorMessage = error.message || 'An error occurred';
  const email = error.customData?.email || 'N/A';
  const credential = GoogleAuthProvider.credentialFromError(error);

  switch (errorCode) {
    case 'auth/account-exists-with-different-credential':
      return `Account exists with a different credential. Email: ${email}`;
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-blocked':
    case 'auth/popup-closed-by-user':
      return 'Popup was blocked or closed. Please try again or use redirect.';
    default:
      return `${errorMessage} (Code: ${errorCode})`;
  }
};

// Export auth và provider để sử dụng ở nơi khác nếu cần
export { auth, googleProvider };