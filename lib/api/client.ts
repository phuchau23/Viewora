import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Interceptor để thêm token và xử lý form data
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        Cookies.remove('token');
        window.location.href = '/login';
      } else if (error.response.status === 500) {
        console.error('Lỗi server:', error.response.data);
      }
    } else {
      console.error('Lỗi kết nối:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;