"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MovieService } from "@/lib/api/service/fetchMovies";
import { useToast } from "@/hooks/use-toast";
import { MovieRequest } from "@/lib/api/service/fetchMovies";

// Hook lấy danh sách phim
export const useMovies = (pageIndex = 1, pageSize = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", pageIndex, pageSize],
    queryFn: () => MovieService.getAllMovies(pageIndex, pageSize),
  });

  return {
    totalPages: data?.totalPages ?? 0,
    movies: data?.items || [],
    isLoading,
    isError: Boolean(error),
    error,
  };
}; 

// Hook lấy phim theo ID
export const useGetMovieById = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => MovieService.getMovieById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    movie: data ?? null,
    isLoading,
    isError: Boolean(error),
    error,
    refetch,
  };
};

// Hook tạo phim
export const useCreateMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: createMovie,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: (data: FormData) => MovieService.createMovie(data),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Movie created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create movie",
        variant: "destructive",
      });
    },
  });

  return { createMovie, isPending, isError, isSuccess, data };
};

// Hook cập nhật phim
export const useUpdateMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: updateMovie,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      MovieService.updateMovie(id, data),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Movie updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to update movie",
        variant: "destructive",
      });
    },
  });

  return { updateMovie, isPending, isError, isSuccess, data };
};

// Hook xóa phim
export const useDeleteMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: deleteMovie,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: (id: string) => MovieService.deleteMovie(id),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Movie deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to delete movie",
        variant: "destructive",
      });
    },
  });

  return { deleteMovie, isPending, isError, isSuccess, data };
};

// Hook chuyển trạng thái sang "Đang chiếu"
export const usePlayMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: playMovie,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: (id: string) => MovieService.playMovie(id),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Movie played successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to play movie",
        variant: "destructive",
      });
    },
  });

  return { playMovie, isPending, isError, isSuccess, data };
};

// Hook chuyển trạng thái sang "Đã kết thúc"
export const useStopMovie = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: stopMovie,
    isPending,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: (id: string) => MovieService.stopMovie(id),
    onSuccess: (response) => {
      toast({
        title: response.statusCode || "Successful",
        description: response.message || "Movie stopped successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (response) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to stop movie",
        variant: "destructive",
      });
    },
  });

  return { stopMovie, isPending, isError, isSuccess, data };
};
