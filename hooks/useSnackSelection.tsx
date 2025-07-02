'use client';
import { useMutation } from "@tanstack/react-query";
import { SnackSelectionRequest, SnackSelectionService } from "@/lib/api/service/fetchSnackSelection";
import { useToast } from "@/hooks/use-toast";

export const useSnackSelection = () => {
  const { toast } = useToast();

  const {
    mutate: createSnackSelection,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: ({data, showTimeId}: {data: SnackSelectionRequest, showTimeId: string}) =>
        SnackSelectionService.createSnackSelection(data, showTimeId),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Snack selection created successfully",
      });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create snack selection",
        variant: "destructive",
      });
    },
  });

  return { createSnackSelection, isPending, isError, isSuccess, data };
};