import apiService from "../core";

export interface APIResponse<T> {
  code: number;
  statusCode: string;
  message: string;
  data: T;
}

export interface SeatHolding {
    showTimeId: string;
    seatId: string[];
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
  };
