import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// API error response data structure
export interface ApiErrorData {
  message?: string;
  code?: string | number;
  [key: string]: unknown;
}

// Error interface
export interface ApiError {
  status?: number;
  message: string;
  error?: ApiErrorData;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Request parameters object
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

// API service class
export class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private onAuthError?: () => void;

  constructor(baseURL: string, timeout = 10000, onAuthError?: () => void) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    });

    this.onAuthError = onAuthError;
    this.setupInterceptors();
  }

  // Set auth token
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Setup request/response interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add auth header if token exists
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Handle FormData automatically
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError<ApiErrorData>) => {
        // Handle authentication errors
        if (error.response?.status === 401 && this.onAuthError) {
          this.onAuthError();
        }

        // Standardize error format
        const apiError: ApiError = {
          status: error.response?.status,
          message: error.response?.data?.message || error.message || 'Unknown error occurred',
          error: error.response?.data || { message: error.message },
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Process parameters for GET requests
  private createParams(params?: RequestParams): URLSearchParams | undefined {
    if (!params) return undefined;

    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach(item => urlParams.append(key, String(item)));
      } else {
        urlParams.append(key, String(value));
      }
    });

    return urlParams;
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
// Handle FormData in config.data
    if (config.data instanceof FormData) {
      // FormData will be handled by the interceptor which removes Content-Type
      // to let the browser set the correct boundary
    }

    const response: AxiosResponse<T> = await this.client(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

   // Public methods
   get<T>(url: string, params?: RequestParams) {
    return this.request<T>({ method: 'GET', url, params: this.createParams(params) });
  }

  post<T, D = any>(url: string, data?: D) {
    return this.request<T>({ method: 'POST', url, data });
  }

  put<T, D = any>(url: string, data?: D) {
    return this.request<T>({ method: 'PUT', url, data });
  }

  delete<T>(url: string, params?: RequestParams) {
    return this.request<T>({ method: 'DELETE', url, params: this.createParams(params) });
  }

  // Upload file(s)
  async upload<T>(
    url: string,
    files: File | File[],
    fieldName = 'file',
    additionalData?: Record<string, string | number | boolean>,
    onProgress?: (percentage: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    // Add file(s)
    if (Array.isArray(files)) {
      files.forEach(file => formData.append(fieldName, file));
    } else {
      formData.append(fieldName, files);
    }

    // Add additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      onUploadProgress: onProgress
        ? progressEvent => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            onProgress(percentage);
          }
        : undefined,
    });
  }
}

// Create and export the default API service instance
const apiService = new ApiService(process.env.NEXT_PUBLIC_API_BASE_URL || '', 600000);

export default apiService;
