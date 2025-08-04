import apiService from "../core";

export interface DiscountType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Promotion {
  id: string;
  title: string;
  image: string;
  startTime: string;
  endTime: string;
  code: string;
  discountPrice: number;
  discountTypeEnum: string;
  discountTypeId: { id: string; name: string } | null; 
  maxDiscountValue: number;
  minOrderValue: number;
  discountUserNum: number;
  statusActive: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PromotionListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: Promotion[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface PromotionResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Promotion;
}

export interface DiscountTypeListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: DiscountType[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const PromotionService = {
  getPromotions: async (pageIndex: number = 1, pageSize: number = 10): Promise<PromotionListResponse> => {
    const response = await apiService.get<PromotionListResponse>(
      `/promotions?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getPromotionById: async (id: string): Promise<PromotionResponse> => {
    try {
      const response = await apiService.get<PromotionResponse>(`/promotions/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Promotion not found");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch promotion");
    }
  },

  getDiscountTypes: async (pageIndex: number = 1, pageSize: number = 10): Promise<DiscountTypeListResponse> => {
    try {
      const response = await apiService.get<DiscountTypeListResponse>(
        `/discounttype?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch discount types");
    }
  },

  createPromotion: async (formData: FormData): Promise<PromotionResponse> => {
    const response = await apiService.post<PromotionResponse>("/promotions", formData);
    return response.data;
  },

  updatePromotion: async (id: string, formData: FormData): Promise<PromotionResponse> => {
    try {
      console.log("Sending FormData to update promotion:", {
        id,
        formData: Object.fromEntries(formData.entries()),
      });
      const response = await apiService.put<PromotionResponse>(`/promotions/${id}`, formData);
      console.log("Update promotion response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update promotion error:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Failed to update promotion");
    }
  },

  deletePromotion: async (id: string): Promise<void> => {
    await apiService.delete(`/promotions/${id}`);
  },

  getPromotionsAvailable: async (userId: string): Promise<PromotionListResponse> => {
    const response = await apiService.get<PromotionListResponse>(`/promotions/available/${userId}`);
    return response.data;
}
}

export default PromotionService;