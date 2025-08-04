// hooks/useSeatHolding.ts
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  SeatHolding,
  SeatHoldingService,
} from "@/lib/api/service/fetchSeatHolding";
import { useToast } from "@/hooks/use-toast";
export const useSeatHoldingsQuery = (showTimeId: string) => {
  return useQuery({
    queryKey: ["seatHoldings", showTimeId],
    queryFn: () => SeatHoldingService.getSeatHoldingsByShowTime(showTimeId),
    enabled: !!showTimeId,
  });
};
export const useSeatHolding = () => {
  const { toast } = useToast();

  const {
    mutate: createSeatHolding,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: ({ data, userId }: { data: SeatHolding; userId: string }) =>
      SeatHoldingService.createSeatHolding(data, userId),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Seat holding created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed",
        description: error?.message || "Failed to create seat holding",
        variant: "destructive",
      });
    },
  });

  return { createSeatHolding, isPending, isError, isSuccess, data };
};

export const useDeleteSeatHolding = () => {
  const {
    mutate: deleteSeatHolding,
    isPending,
    data,
  } = useMutation({
    mutationFn: ({ showtimeId, userId }: { showtimeId: string; userId: string }) =>
      SeatHoldingService.deleteSeatHolding(showtimeId, userId),
  });

  return { deleteSeatHolding, isPending, data };
};

