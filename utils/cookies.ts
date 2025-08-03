import Cookies from 'js-cookie';

// 1. Lưu token vào cookie
export function saveTokenToCookie(token: string, cookieName = 'auth-token', days = 1) {
  Cookies.set(cookieName, token, {
    expires: days, // alternative to maxAge for js-cookie
    path: '/',
    sameSite: 'Lax', // bảo vệ CSRF
    secure: process.env.NODE_ENV === 'production', // chỉ https nếu production
  });
}

// 2. Lấy token từ cookie
export function getToken(cookieName = 'auth-token'): string | null {
  return Cookies.get(cookieName) || null;
}

// 3. Kiểm tra token đã hết hạn hay chưa (chỉ dùng được với JWT chuẩn)
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return now >= exp;
  } catch {
    return true; // nếu lỗi decode hoặc token không hợp lệ
  }
}

// 4. Dọn token nếu đã hết hạn (gọi khi app khởi chạy)
export function cleanExpiredTokenOnLoad(cookieName = 'auth-token'): boolean {
  const token = getToken(cookieName);
  if (token && isTokenExpired(token)) {
    Cookies.remove(cookieName, { path: '/' });
    return true; // đã xóa
  }
  return false; // hợp lệ hoặc không có
}
