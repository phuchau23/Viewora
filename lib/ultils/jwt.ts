import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  role?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  userId?: string;
  iat?: number;
  nbf?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * Lấy token từ cookies
 */
const getToken = (): string | undefined => {
  return Cookies.get("auth-token");
};

/**
 * Giải mã token và trả về thông tin
 * @param token Token cần giải mã
 * @returns Thông tin từ token hoặc null nếu token không hợp lệ
 */
const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

/**
 * Kiểm tra token có hợp lệ không (dựa trên thời gian hết hạn)
 * @param token Token cần kiểm tra
 * @returns True nếu token hợp lệ, False nếu không
 */
const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (seconds)
  return decoded.exp > currentTime;
};

/**
 * Lấy thông tin từ token (token từ cookies)
 * @returns Thông tin từ token hoặc null nếu không có token hoặc token không hợp lệ
 */
const getTokenInfo = (): DecodedToken | null => {
  const token = getToken();
  if (!token) {
    return null;
  }

  return decodeToken(token);
};

/**
 * Lấy một trường cụ thể từ token
 * @param field Trường cần lấy (ví dụ: "role", "email")
 * @returns Giá trị của trường hoặc undefined nếu không tìm thấy
 */
const getTokenField = (field: keyof DecodedToken): any => {
  const tokenInfo = getTokenInfo();
  return tokenInfo ? tokenInfo[field] : undefined;
};

/**
 * Lấy role của user từ token
 * @returns Role của user hoặc undefined nếu không tìm thấy
 */
const getUserRole = (): string | undefined => {
  return getTokenField("role");
};

/**
 * Lấy userId từ token
 * @returns userId hoặc undefined nếu không tìm thấy
 */
const getUserId = (): string | undefined => {
  return getTokenField("userId");
};

/**
 * Lấy email từ token
 * @returns Email hoặc undefined nếu không tìm thấy
 */
const getUserEmail = (): string | undefined => {
  return getTokenField("email");
};

/**
 * Lấy tên đầy đủ của user từ token
 * @returns Tên đầy đủ hoặc undefined nếu không tìm thấy
 */
const getUserFullName = (): string | undefined => {
  return getTokenField("full_name");
};

/**
 * Lấy số điện thoại của user từ token
 * @returns Số điện thoại hoặc undefined nếu không tìm thấy
 */
const getUserPhoneNumber = (): string | undefined => {
  return getTokenField("phone");
};

export { getToken, decodeToken, isTokenValid, getTokenInfo, getTokenField, getUserRole, getUserId, getUserEmail, getUserFullName, getUserPhoneNumber };