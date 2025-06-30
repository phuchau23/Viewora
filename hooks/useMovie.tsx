"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MovieCreateRequest,
  MovieService,
} from "@/lib/api/service/fetchMovies";
import { MovieResponse } from "@/lib/api/service/fetchMovies";
import { useMutation } from "@tanstack/react-query";

export const useMovies = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: () => MovieService.getAllMovies(),
    select: (data: MovieResponse) => data.data,
  });

  return {
    movies: data?.items || [],
    totalItems: data?.totalItems || 0,
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    pageSize: data?.pageSize || 10,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    isLoading,
    isError: !!error,
    error,
  };
};

export function useCreateMovie() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: MovieService.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  return mutation; // return toàn bộ object
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  const { mutate, isError, isSuccess, data } = useMutation({
    mutationFn: (id: string) => MovieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  return {
    mutate,
    isError,
    isSuccess,
    data,
  };
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      MovieService.updateMovie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  return mutation;
}

export function useGetMovieById(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => MovieService.getMovieById(id),
    enabled: !!id,
  });
}

export function usePlayMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MovieService.playMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useStopMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MovieService.stopMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
