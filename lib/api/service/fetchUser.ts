import apiService from "../core";

export interface User {
    accountId: number;
    roleId: number | null;
    username: string;
    password: string;
    fullName: string;
    email: string;
    dateOfBirth: string | null;
    phoneNumber: string;
    avatar: string;
    identityCard: string;
    address: string;
    gender: number; // Represents Gender enum (e.g., 0 for Male, 1 for Female)
    rewardPoint: number;
    createdAt: string | null;
    updatedAt: string | null;
    isVerified: boolean;
    isActive: boolean;
    role: any | null; // Use specific Role interface if defined
    employee: any | null; // Use specific Employee interface if defined
}


export interface ProfileDataResponse {
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string | null;
  identityCard: string | null;
  address: string | null;
  dateOfBirth: string;
  gender: number;
  rewardPoint: number;
}
export interface ProfileResponse{
  code: string;
  statusCode: string;
  message: string;
  data :ProfileDataResponse
}

export interface UserResponse {
  code: number;
  statusCode: string;
  message: string;
  data: User;
}

export interface ProfileUpdateDataResponse {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string | null;
  identityCard: string | null;
  address: string | null;
  dateOfBirth: string;
  gender: number;
  rewardPoint: number;
}

export interface ProfileUpdateResponse {
    code: number;
    statusCode: string;
    message?: string;
    data?: ProfileUpdateDataResponse;
  }
  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  
  export interface ChangePasswordResponse {
    code: number;
    statusCode: string;
    message: string;
    data: null;
  }
export const UserService = {
    //get User
    getUser: async () => {
        const response = await apiService.get<UserResponse>("/users");
        return response.data;
    },
   
    getProfile: async (): Promise<ProfileResponse> => {
      const response = await apiService.get<ProfileResponse>("/users/profile");
      return response.data;
    },
    
    deleteUser: async (id: number): Promise<UserResponse> => {
      const response = await apiService.patch<UserResponse>(
        `/users/${id}/active`
      );
      return response.data;
  },

    updateUserProfile: async (profileData: Partial<ProfileUpdateDataResponse> | FormData): Promise<ProfileUpdateResponse> => {
        // The API service already handles FormData appropriately in its interceptors
        const response = await apiService.put<ProfileUpdateResponse, Partial<ProfileUpdateDataResponse> | FormData>(
          '/users/update-profile',
          profileData
        );
        return response.data;
      },
      changePassword: async (payload: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await apiService.put<ChangePasswordResponse, ChangePasswordRequest>(
          '/users/change-password',
          payload
        );
        return response.data;
      },
}

export default UserService;