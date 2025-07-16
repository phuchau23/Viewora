import apiService from "../core";

export interface SnackSelectionResponse {
  code: number;
  statusCode: string;
  message: string;
  data: SnackSelection[];
}

export interface SnackSelectionRequest {
    snackId: string;
    quantity: number;
}

export interface SnackSelection {
  id: string;
  showTimeId: string;
  snack: Snack[];
  quantity: number;
  unitPrice: number;
}

export interface Snack {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export const SnackSelectionService = {
    createSnackSelection: async (data: SnackSelectionRequest, showTimeId: string) => {
    const response = await apiService.post<SnackSelectionResponse>(
      `/snackselection?showTimeId=${showTimeId}`,
      data,
    );
    return response.data;
  },
};
