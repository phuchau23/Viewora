import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import PromotionService, {
  PromotionListResponse,
  PromotionResponse,
} from "@/lib/api/service/fetchPromotion";

export function usePromotion(id: string) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["promotion", id],
    queryFn: () => PromotionService.getPromotionById(id),
    enabled: isAuthenticated && !!id,
    select: (data: PromotionResponse) => ({
      promotion: data.data,
      status: data.statusCode,
      message: data.message,
    }),
  });

  return {
    data, // Contains promotion, status, and message
    isLoading,
    isFetching,
    isError: error !== null,
    error,
  };
}

export function usePromotions(pageIndex = 1, pageSize = 10) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["promotions", pageIndex, pageSize],
    queryFn: () => PromotionService.getPromotions(pageIndex, pageSize),
    enabled: isAuthenticated,
    select: (data: PromotionListResponse) => ({
      promotions: data.data.items,
      total: data.data.totalItems,
      currentPage: data.data.currentPage,
      totalPages: data.data.totalPages,
      status: data.statusCode,
      message: data.message,
    }),
  });

  return {
    data,
    isLoading,
    isError: !!queryError,
    error: queryError,
  };
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  const {
    mutate: createPromotion,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: (formData: FormData) =>
      PromotionService.createPromotion(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });

  return {
    createPromotion,
    isCreating,
    createError,
  };
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  const {
    mutate: deletePromotion,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => PromotionService.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });

  return {
    deletePromotion,
    isDeleting,
    deleteError,
  };
}
