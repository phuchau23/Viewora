import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateShowtimeDto,
  ShowTimeService,
} from "@/lib/api/service/fetchShowTime";
import { toast } from "sonner";

export const useShowTime = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["showtime"],
    queryFn: () => ShowTimeService.getShowTime(),
    enabled: true,
  });

  const showTimeArray = response?.data?.items ?? [];

  return {
    showTime: showTimeArray,
    isLoading,
    error,
  };
};

export const useCreateShowTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newShowtime: CreateShowtimeDto) =>
      ShowTimeService.createShowtime(newShowtime),
    onSuccess: () => {
      toast.success("🎉 Suất chiếu đã được tạo thành công!");
      queryClient.invalidateQueries({ queryKey: ["showtime"] });
    },
    onError: () => {},
  });
};

export const useShowTimeByMovieId = (movieId: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["showtime", movieId],
    queryFn: () => ShowTimeService.getShowTimeByMovieId(movieId),
    enabled: !!movieId,
  });

  const rawData = response;

  const showTimeArray = Array.isArray(rawData)
    ? rawData
    : rawData
    ? [rawData]
    : [];

  return {
    showTime: showTimeArray,
    isLoading,
    error,
  };
};
export const useDeleteShowTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ShowTimeService.deleteShowtime(id),
    onSuccess: () => {
      toast.success("🗑️ Xoá suất chiếu thành công");
      queryClient.invalidateQueries({ queryKey: ["showtime"] });
    },
    onError: (error: any) => {
      toast.error("❌ Lỗi khi xoá suất chiếu");
    },
  });
};
