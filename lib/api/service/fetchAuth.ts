import apiService from "../core";
export interface RegisterResponse {
  code: string;
  statusCode: string;
  message: string;
  data?: [];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    code: string;
    statusCode: string;
    message: string;
    data?: Token;
}

export interface Token {
    fullName: string;
    token: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  DateOfBirth: string;
  password: string;
  phoneNumber: string;
  Gender: string;
  avatarFile?: File;
}

export const fetchAuth = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const { avatarFile, ...additionalData } = data;
        const files = avatarFile ? [avatarFile] : [];
    
        const response = await apiService.upload<RegisterResponse>(
          '/auth/register',
          files,
          'avatarFile',
          additionalData
        );
        return response.data;
      },
    
     login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiService.post<LoginResponse>(
          '/auth/login',
          {
            email: data.email,
            password: data.password,
          }
        );
        return response.data;
      },
      
};
