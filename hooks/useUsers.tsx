import UserService, {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ProfileResponse,
  ProfileUpdateDataResponse,
  ProfileUpdateResponse,
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
      // Không check data.status nữa!
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
      // Có thể show toast thành công, đóng modal, v.v...
    },
  });
}
export function useChangePassword() {
  return useMutation<ChangePasswordResponse, any, ChangePasswordRequest>({
    mutationFn: (payload) => UserService.changePassword(payload),
  });
}
