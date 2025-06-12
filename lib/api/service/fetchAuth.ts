'use client'
import apiService from "../core";
// register
export interface RegisterRequest {
  Email: string;
  FullName: string;
  DateOfBirth: string;
  Password: string;
  PhoneNumber: string;
  Gender: number | undefined;
}

export interface RegisterResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}

// login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: Token;
}

// token
export interface Token {
  fullName: string;
  token: string;
}

// verify email
export interface VerifyEmailRequest {
  optCode: number;
  Email: string;
}

export interface VerifyEmailResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}

// login with google
export interface LoginWithGoogleRequest {
  idToken: string;
}

export interface LoginWithGoogleResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: {
    token: string;
    fullName?: string;
  };
}

// forgot password
export interface ForgotPasswordRequest {
  Email: string;
}

export interface ForgotPasswordResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}

// verify reset password
export interface VerifyResetPasswordRequest {
  optCode: number;
  Email: string;
}

export interface VerifyResetPasswordResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
} 

// reset password
export interface ResetPasswordRequest {
  Email: string;
  optCode: number;
  Password: string;
}

export interface ResetPasswordResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}

// resend verify email
export interface ResendVerifyEmailRequest {
  Email: string;
}

export interface ResendVerifyEmailResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}


export const fetchAuth = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiService.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await apiService.post<VerifyEmailResponse>("/auth/verify-email", data);
    return response.data;
  },

  resendVerifyEmail: async (data: ResendVerifyEmailRequest): Promise<ResendVerifyEmailResponse> => {
    const response = await apiService.post<ResendVerifyEmailResponse>("/auth/resend-verify-email", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login", {email: data.email, password: data.password}, true); // Sử dụng JSON
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await apiService.post<ForgotPasswordResponse>("/auth/forgot-password", data);
    return response.data;
  },

  verifyResetPassword: async (data: VerifyResetPasswordRequest): Promise<VerifyResetPasswordResponse> => {
    const response = await apiService.post<VerifyResetPasswordResponse>("/auth/verify-reset-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiService.post<ResetPasswordResponse>("/auth/reset-password", data);
    return response.data;
  },

  loginWithGoogle: async (data: LoginWithGoogleRequest): Promise<LoginWithGoogleResponse> => {
    const idToken = data;
    console.log("idToken trước khi gửi:", idToken);


      const response = await apiService.post<LoginWithGoogleResponse>("/auth/google-login", { id_token: idToken }, true); // Sử dụng JSON
      if (!response.data || response.data.code !== 200) throw new Error(response.data?.message || "Đăng nhập Google thất bại.");
      return response.data;
    }  
};