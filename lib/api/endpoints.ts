const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("BASE_URL =", BASE_URL); // kiểm tra lại giá trị

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  USERS: `${BASE_URL}/users`,
  USER: (id: string) => `${BASE_URL}/users/${id}`,
  UPLOAD: `${BASE_URL}/upload`,
  LOGOUT: `${BASE_URL}/logout`,
} as const;