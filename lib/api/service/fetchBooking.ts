
import apiService from "../core";

export interface BookingRequest {
  seatIds: string[];
  snackSelection: SnackSelection[];
  promotionCode: string;
  paymentMethod: string;
  showtimeId: string;
}

export interface APIResponse<T> {
  code: number;
  statusCode: string;
  message: string;
  data: T;
}

export interface SnackSelection {
  snackId: string;
  quantity: number;
}

export interface BookingResponse {
  paymentUrl: string;
  bookingId: string;
}
export interface BookingItem {
    id: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      phoneNumber: string;
    };
    showTime: {
      id: string;
      movie: {
        id: string;
        name: string;
        duration: string;
      };
      branch: {
        id: string;
        name: string;
        address: string;
        phoneNumber: string;
        room: {
          id: string;
          roomNumber: number;
          roomType: {
            id: string;
            name: string;
          };
        };
      };
      startTime: string;
      endTime: string;
    };
    seats: {
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
    }[];
    snackSelections: {
      id: string;
      snack: {
        id: string;
        name: string;
        price: number;
        image: string;
      };
      quantity: number;
      unitPrice: number;
    }[];
    promotion: any; // hoặc bạn có thể thay bằng `Promotion | null` nếu có định nghĩa Promotion riêng
    totalPrice: string;
    createdAt: string;
    qrCodeUrl: string;
  }
export interface BookingHistoryResponse { 
      items: BookingItem[];
      totalItems: number;
      currentPage: number;
      totalPages: number;
      pageSize: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
  }
export const BookingService = {
  createBooking: async (data: BookingRequest) => {
    const response = await apiService.post<APIResponse<BookingResponse>>(
      "/bookings",
      data,
      true
    );
    return response.data;
  },


  getBookingHistory: async (pageIndex = 1, pageSize = 10) => {
    const response = await apiService.get<APIResponse<BookingHistoryResponse>>(
      `/bookings?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await apiService.get<APIResponse<BookingItem>>(
      `/bookings/${bookingId}`
    );
    return response.data;
  },
};
