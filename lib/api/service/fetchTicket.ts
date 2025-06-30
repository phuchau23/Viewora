// lib/api/service/fetchTicket.ts
import apiService from "../core"; // Giả sử bạn có một apiService để xử lý HTTP requests

// Interface cho vé
export interface Ticket {
  id: string;
  movieName: string;
  bookingDate: string;
  theater: string;
  showTime: string;
  userName: string;
  userEmail: string;
  seatNumber: string;
  ticketPrice: number;
  screen?: string;
  dressCircle?: string;
  bookingId?: string;
}

// Interface cho response từ API
export interface TicketListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: Ticket[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Interface cho tham số tìm kiếm
export interface TicketSearchParams {
  pageIndex?: number;
  pageSize?: number;
}

// Hàm chuyển đổi tham số tìm kiếm thành query params
const convertTicketFilters = (filters?: TicketSearchParams): Record<string, any> => {
  if (!filters) return {};

  const params: Record<string, any> = {};

  if (filters.pageIndex !== undefined) params.pageIndex = filters.pageIndex;
  if (filters.pageSize !== undefined) params.pageSize = filters.pageSize;

  return params;
};

// TicketService để xử lý API calls
export const TicketService = {
  getTickets: async (filters?: TicketSearchParams): Promise<TicketListResponse> => {
    const params = convertTicketFilters(filters);
    const response = await apiService.get<TicketListResponse>("/tickets", params);
    return response.data;
  },
};

export default TicketService;