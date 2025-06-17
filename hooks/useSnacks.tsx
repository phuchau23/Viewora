// hooks/useSnacks.ts
import SnackService, {
  SnackListResponse,
  SnackResponse,
} from "@/lib/api/service/fetchSnack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export function useSnack(id: string) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["snack", id],
    queryFn: () => SnackService.getSnackById(id),
    enabled: isAuthenticated && !!id,
    select: (data: SnackResponse) => ({
      snack: data.data,
      status: data.statusCode,
      message: data.message,
    }),
  });

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
  };
}

export function useSnacks(pageIndex = 1, pageSize = 10) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;
  const queryClient = useQueryClient();

  // Get all snacks
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["snacks", pageIndex, pageSize],
    queryFn: () => SnackService.getSnacks(pageIndex, pageSize),
    enabled: isAuthenticated,
    select: (data: SnackListResponse) => ({
      snacks: data.data.items,
      total: data.data.totalItems,
      currentPage: data.data.currentPage,
      totalPages: data.data.totalPages,
      status: data.statusCode,
      message: data.message,
    }),
  });

  // Create snack with FormData
  const {
    mutate: create,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: (formData: FormData) => SnackService.createSnack(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
    },
  });

  // Update snack
  const {
    mutate: update,
    isPending: isUpdating,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      SnackService.updateSnack(id, formData),
    onSuccess: (_, variables) => {
      // Invalidate both snacks list and specific snack
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
      queryClient.invalidateQueries({ queryKey: ["snack", variables.id] });
      // Optionally, refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ["snacks"] });
      queryClient.refetchQueries({ queryKey: ["snack", variables.id] });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
    },
  });

  // Delete snack
  const {
    mutate: deleteSnack,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => SnackService.deleteSnack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snacks"] });
    },
  });

  return {
    data,
    isLoading,
    isError: !!queryError,
    error: queryError,
    create,
    isCreating,
    createError,
    update,
    isUpdating,
    updateError,
    delete: deleteSnack,
    isDeleting,
    deleteError,
  };
}
