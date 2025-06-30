import UserService, {
  BookingHistoryResponse,
  BookingHistorySelectedData,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ProfileResponse,
  ProfileUpdateDataResponse,
  ProfileUpdateResponse,
  ScoreHistoryResponse,
  ScoreHistorySelectedData,
  ScoreRecord,
} from "@/lib/api/service/fetchUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UserListResponse,
  UserSearchParams,
} from "@/lib/api/service/fetchUser";

export function useUsers(filters?: UserSearchParams) {
  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUser(filters),
    select: (data: UserListResponse) => ({
      users: data.data.items,
      status: data.statusCode,
      totalItems: data.data.totalItems,
      currentPage: data.data.currentPage,
      totalPages: data.data.totalPages,
      pageSize: data.data.pageSize,
      hasPreviousPage: data.data.hasPreviousPage,
      hasNextPage: data.data.hasNextPage,
    }),
  });
  return {
    isError,
    isLoading,
    error,
    users: data?.users,
    totalItems: data?.totalItems,
    currentPage: data?.currentPage,
    totalPages: data?.totalPages,
    pageSize: data?.pageSize,
    hasPreviousPage: data?.hasPreviousPage,
    hasNextPage: data?.hasNextPage,
  };
}
import { getCookie } from "cookies-next";

export function useUserProfile() {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<ProfileResponse>({
    queryKey: ["users", "profile"],
    queryFn: () => UserService.getProfile(),
    enabled: isAuthenticated,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<ProfileUpdateDataResponse> | FormData) =>
      UserService.updateUserProfile(profileData),
    onSuccess: (data: ProfileUpdateResponse) => {
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
    },
  });
}
export function useChangePassword() {
  return useMutation<ChangePasswordResponse, any, ChangePasswordRequest>({
    mutationFn: (payload) => UserService.changePassword(payload),
  });
}

export function useScoreHistory(filters?: {
  FromDate?: string;
  ToDate?: string;
  ActionType?: string;
}) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<ScoreHistoryResponse, Error, ScoreHistorySelectedData>({
    queryKey: ["scoreHistory", filters],
    queryFn: () => UserService.getScoreHistory(filters),
    enabled: isAuthenticated,
    select: (data: ScoreHistoryResponse) => ({
      records: data.data,
      status: data.statusCode,
      message: data.message,
    }),
  });
}
export function useBookingHistory(params?: {
  pageIndex?: number;
  pageSize?: number;
}) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<BookingHistoryResponse, Error, BookingHistorySelectedData>({
    queryKey: ["bookingHistory", params],
    queryFn: () => UserService.getBookingHistory(params),
    enabled: isAuthenticated,
    select: (data: BookingHistoryResponse) => ({
      bookings: data.data.items,
      status: data.statusCode,
      message: data.message,
      totalItems: data.data.totalItems,
      currentPage: data.data.currentPage,
      totalPages: data.data.totalPages,
      pageSize: data.data.pageSize,
      hasPreviousPage: data.data.hasPreviousPage,
      hasNextPage: data.data.hasNextPage,
    }),
  });
}
