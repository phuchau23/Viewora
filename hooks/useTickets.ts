// lib/hooks/useTickets.ts
import TicketService, { Ticket, TicketListResponse, TicketSearchParams } from "@/lib/api/service/fetchTicket";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export interface TicketSelectedData {
  tickets: Ticket[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  status: string;
  message: string;
}

export function useTickets(filters?: TicketSearchParams) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<TicketListResponse, Error, TicketSelectedData>({
    queryKey: ["tickets", filters],
    queryFn: () => TicketService.getTickets(filters),
    enabled: isAuthenticated, // Chỉ fetch khi người dùng đã đăng nhập
    select: (data: TicketListResponse) => ({
      tickets: data.data.items,
      status: data.statusCode,
      totalItems: data.data.totalItems,
      currentPage: data.data.currentPage,
      totalPages: data.data.totalPages,
      pageSize: data.data.pageSize,
      hasPreviousPage: data.data.hasPreviousPage,
      hasNextPage: data.data.hasNextPage,
      message: data.message,
    }),
  });
}