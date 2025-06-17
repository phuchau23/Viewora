// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { ShowTimeService } from "@/lib/api/service/fetchShowTime";
// import { ShowTime } from "@/lib/api/service/fetchShowTime";

// export const useShowTimeByMovieId = (movieId?: string) => {
//   const { data, isLoading, error } = useQuery<ShowTime[]>({
//     queryKey: ["showtimes", movieId],
//     queryFn: () => ShowTimeService.getShowTimeByMovieId(movieId!), // đã trả về ShowTime[]
//     enabled: !!movieId,
//   });

//   console.log("Raw response:", data); // log để kiểm tra

//   return {
//     showTime: data || [],
//     isLoading,
//     error,
//   };
// };
// useShowTimeByMovieId.ts
import { useQuery } from "@tanstack/react-query";
import { ShowTimeService } from "@/lib/api/service/fetchShowTime";

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

  // ✅ Normalize: luôn trả về mảng
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
