// lib/api/service/fetchSnack.ts
import apiService from "../core";

export interface Snack {
  id: string;
  name: string;
  price: number;
  image?: string;
  isAvailable?: boolean;
  quantity?: number;
  originalPrice?: number;
}

export interface SnackListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: Snack[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface SnackResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Snack;
}

export const SnackService = {
  getSnacks: async (pageIndex: number = 1, pageSize: number = 10): Promise<SnackListResponse> => {
    const response = await apiService.get<SnackListResponse>(
      `/snacks?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  },
   
  getSnackById: async (id: string): Promise<SnackResponse> => {
    try {
      const response = await apiService.get<SnackResponse>(`/snacks/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Snack not found");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch snack");
    }
  },

  createSnack: async (formData: FormData): Promise<SnackResponse> => {
    const response = await apiService.post<SnackResponse>("/snacks", formData,)
    return response.data;
  },

  updateSnack: async (id: string, formData: FormData): Promise<SnackResponse> => {
    try {
      const response = await apiService.put<SnackResponse>(`/snacks/${id}`, formData, )
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update snack");
    }
  },

  deleteSnack: async (id: string): Promise<void> => {
    await apiService.delete(`/snacks/${id}`);
  },
};

export default SnackService;