import apiService from "../core";

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

export interface Token {
  fullName: string;
  token: string;
}

export interface RegisterRequest {
  Email: string;
  FullName: string;
  DateOfBirth: string;
  Password: string;
  PhoneNumber: string;
  Gender: number;
  avatarFile?: File;
}

export interface RegisterResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: [];
}

export interface VerifyEmailRequest {
  optCode: number;
  Email: string;
}

export interface VerifyEmailResponse {
  code: number;
  statusCode: string;
  message: string;
  data?: null;
}
export const fetchAuth = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const { avatarFile, ...additionalData } = data;
        const files = avatarFile ? [avatarFile] : [];
        const formattedData = {
          Email: additionalData.Email,
          FullName: additionalData.FullName,
          DateOfBirth: additionalData.DateOfBirth,
          Password: additionalData.Password,
          PhoneNumber: additionalData.PhoneNumber,
          Gender: additionalData.Gender,
        };
        console.log('Sending register data:', formattedData);
        try {
          const response = await apiService.upload<RegisterResponse>(
            "/auth/register",
            files,
            "avatarFile",
            formattedData
          );
          console.log('Register response:', response.data);
          if (!response.data) {
            throw new Error("Không nhận được dữ liệu từ server");
          }
          return response.data;
        } catch (error) {
          console.error('Register API error:', error);
          throw error;
        }
      },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const additionalData = {
      optCode: data.optCode,
      Email: data.Email,
    };
    console.log('Verify email payload:', additionalData);
    try {
      const response = await apiService.upload<VerifyEmailResponse>(
        "/auth/verify-email",
        [], // Không có file
        "file", // Không dùng field này vì không có file, nhưng cần truyền
        additionalData
      );
      if (!response.data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },    
};

