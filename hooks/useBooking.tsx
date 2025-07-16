"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BookingService,
  BookingRequest,
  APIResponse,
  BookingResponse,
  BookingHistoryResponse,
} from "@/lib/api/service/fetchBooking";
import { useToast } from "@/hooks/use-toast";

export const useBooking = () => {
  const { toast } = useToast();

  const {
    mutateAsync: createBooking, // ✅ dùng mutateAsync để await được
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation<APIResponse<BookingResponse>, any, BookingRequest>({
    mutationFn: (data) => BookingService.createBooking(data),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Booking created successfully",
      });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  return { createBooking, isPending, isError, isSuccess, data };
};
export const useBookingHistory = (pageIndex = 1, pageSize = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", pageIndex, pageSize],
    queryFn: () => BookingService.getBookingHistory(pageIndex, pageSize),
  });

  return {
    totalPages: data?.data.totalPages ?? 0,
    bookings: data?.data.items || [],
    isLoading,
    isError: Boolean(error),
    error,
  };
};

export const useBookingById = (bookingId: string) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["booking", bookingId],
      queryFn: () => BookingService.getBookingById(bookingId),
      enabled: !!bookingId
    });
  
    return {
      booking: data?.data,
      isLoading,
      isError: Boolean(error),
      error,
    };
  };
  
