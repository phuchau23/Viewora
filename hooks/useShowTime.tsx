import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateShowtimeDto,
  ShowTimeService,
  ShowTime,
} from "@/lib/api/service/fetchShowTime";
import { toast } from "sonner";

export const useShowTime = (startDate: string, endDate: string) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["showtime", startDate, endDate], // ✅ Bắt buộc thêm vào
    queryFn: () => ShowTimeService.getShowTime(startDate, endDate),
    enabled: !!startDate && !!endDate, // ✅ sửa dòng này
  });

  const showTimeArray = response?.data ?? [];

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

  const showTimeArray = Array.isArray(response)
    ? response
    : response
    ? [response]
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

export const useShowtimesByBranchId = (branchId: string | null) => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery<ShowTime[]>({
    queryKey: ["showtimes", branchId],
    queryFn: () =>
      branchId
        ? ShowTimeService.getShowtimesByBranchId(branchId)
        : Promise.resolve([]),
    enabled: !!branchId,
  });

  const showtimesArray = Array.isArray(response) ? response : [];

  return {
    showtimes: showtimesArray,
    isLoading,
    error,
  };
};
