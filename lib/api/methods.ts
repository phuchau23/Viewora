import api from './client';
import { ENDPOINTS } from './endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // Thêm các thông tin khác
  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return api.post(ENDPOINTS.LOGIN, credentials);
};

export const loginWithGoogle = () => {
  // Mở popup hoặc chuyển hướng đến OAuth URL
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.GOOGLE_AUTH}`;
};

export const logout = async () => {
  // Có thể gọi API logout nếu có
  return Promise.resolve();
};