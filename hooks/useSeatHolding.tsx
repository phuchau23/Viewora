'use client';
import { useMutation } from "@tanstack/react-query";
import { SeatHolding, SeatHoldingService } from "@/lib/api/service/fetchSeatHolding";
import { useToast } from "@/hooks/use-toast";

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
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create seat holding",
        variant: "destructive",
      });
    },
  });

  return { createSeatHolding, isPending, isError, isSuccess, data };
};