import apiService from "../core";

export interface User {
    id: number;
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


export interface UserListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: User[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
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


  export interface UserSearchParams {
    searchTerm?: string;
    pageNumber?: number;
    pageSize?: number;
    isDescending?: boolean;
    roleId?: number;
    isActive?: boolean;
    gender?: number;
  }
  

  // Add to fetchUser.ts
  export interface ScoreRecord {
    id: string; 
    createdAt: string;
    movieName: string;
    scoreChanged: number; 
    actionType: "Added" | "Used"; 
  }
export interface ScoreHistoryResponse {
  code: number;
  statusCode: string;
  message: string;
  data: ScoreRecord[];
}

export interface ScoreHistorySelectedData {
  records: ScoreRecord[];
  status: string;
  message: string;
}
// Interface for the seat
export interface Seat {
  id: string;
  row: string;
  number: number;
  seatType: {
    id: string;
    name: string;
    price: {
      id: string;
      timeInDay: string;
      amount: number;
    };
  };
}

// Interface for the showtime
export interface ShowTime {
  id: string;
  movie: {
    id: string;
    name: string;
    duration: string;
  };
  branch: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
}

// Interface for the promotion (if applicable)
export interface Promotion {
  id: string;
  title: string;
  code: string;
  discountPrice: number;
  discountTypeEnum: string;
  discountType: {
    id: string;
    name: string;
  };
  maxDiscountValue: number;
  minOrderValue: number;
}

// Interface for a single booking item
export interface Booking {
  bookingId: string;
  bookingDate: string;
  showTime: ShowTime;
  seats: Seat[];
  snacks: any[];
  promotion: Promotion | null;
  totalPrice: number;
  createdAt: string;
}

// Interface for the booking history response
export interface BookingHistoryResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: Booking[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Interface for selected data after transformation
export interface BookingHistorySelectedData {
  bookings: Booking[];
  status: string;
  message: string;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

  const convertUserFilters = (filters?: UserSearchParams): Record<string, any> => {
    if (!filters) return {};
  
    const params: Record<string, any> = {};
  
    if (filters.searchTerm) params.searchTerm = filters.searchTerm;
    if (filters.pageNumber !== undefined) params.pageNumber = filters.pageNumber;
    if (filters.pageSize !== undefined) params.pageSize = filters.pageSize;
    if (filters.isDescending !== undefined) params.isDescending = filters.isDescending;
    if (filters.roleId !== undefined) params.roleId = filters.roleId;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.gender !== undefined) params.gender = filters.gender;
  
    return params;
  };


export const UserService = {
    //get User
    getUser: async (filters?: UserSearchParams): Promise<UserListResponse> => {
      const params = convertUserFilters(filters);
      const response = await apiService.get<UserListResponse>("/users", params);
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

      // Add to UserService in fetchUser.ts
    getScoreHistory: async (params?: {
      FromDate?: string;
      ToDate?: string;
      ActionType?: string;
  }): Promise<ScoreHistoryResponse> => {
     const response = await apiService.get<ScoreHistoryResponse>(
          "/users/view-score-history",
          params
        );
        return response.data;
        },

        getBookingHistory: async (params: {
          pageIndex?: number;
          pageSize?: number;
        } = {}): Promise<BookingHistoryResponse> => {
          const response = await apiService.get<BookingHistoryResponse>(
            "/users/view-booking-history",
            {
              pageIndex: params.pageIndex ?? 1,
              pageSize: params.pageSize ?? 10,
            }
          );
          return response.data;
        },
}

export default UserService;