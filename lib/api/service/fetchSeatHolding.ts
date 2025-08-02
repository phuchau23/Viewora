// lib/api/service/fetchSeatHolding.ts
import apiService from "../core";

export interface APIResponse<T> {
  code: number;
  statusCode: string;
  message: string;
  data: T;
}

export interface SeatHolding {
  id: string;
  showTimeId: string;
  seatId: string;
  status: "Holding" | "Sold";
}

export const SeatHoldingService = {
  createSeatHolding: async (data: SeatHolding, userId: string) => {
    const response = await apiService.post<APIResponse<SeatHolding>>(
      `/seatHoldings/hold/userId=${userId}`,
      data,
      true
    );
    return response.data;
  },

  deleteSeatHolding: async (seatHoldingId: string) => {
    const response = await apiService.delete<APIResponse<SeatHolding>>(
      `/seatHoldings/${seatHoldingId}`
    );
    return response.data;
  },

  getSeatHoldingsByShowTime: async (showTimeId: string) => {
    const response = await apiService.get<APIResponse<SeatHolding[]>>(
      `/seatholding?showTimeId=${showTimeId}`
    );
    return response.data;
  },
};
