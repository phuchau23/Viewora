"use client";
import apiService from "../core";

export interface Movie {
  id: string;
  name: string;
  banner: string;
  poster: string;
  description: string;
  director: string;
  actor: string;
  duration: number;
  rate: number;
  releaseDate: string;
  trailerUrl: string;
  startShow: string;
  createdAt: string;
  updatedAt: string;
  age: string;
  status: string;
  isAvailable: boolean;
  movieTypes: string[];
}

export interface MovieResponse {
  code: number;
  statusCode: number;
  message: string;
  data: {
    items: Movie[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface MovieCreateRequest {
    Name: string;
    Description: string;
    Director: string;
    Actor: string;
    Duration: number;
    Rate: number;
    ReleaseDate: string;
    TrailerUrl: string;
    StartShow: string;
    Age: string;
    Status: string;
    IsAvailable: boolean;
    MovieTypeNames: Array<string>;
    Banner: File;
    Poster: File;
}

export interface MovieCreateResponse {
    code: number;
    statusCode: string;
    message: string;
    data: Movie;
}

export const MovieService = {

    getMoviesAdmin: async () => {
        const response = await apiService.get<MovieResponse>("/movies/admin");
        return response.data;
    },

    createMovie: async (formData: FormData) => {
        const response = await apiService.upload<MovieCreateResponse>("/movies", );
        return response.data;
    },
    deleteMovie: async (id: string) => {
        const response = await apiService.delete<MovieResponse>(`/movies/${id}`);
        return response.data;
    },
    updateMovie: async (id: string, formData: FormData) => {
        const response = await apiService.put<MovieResponse>(`/movies/${id}`, formData);
        return response.data;
    },
    getMovies: async () => {
        const response = await apiService.get<MovieResponse>("/movies");
        return response.data;
    },
    getMovieById: async (id: string) => {
        const response = await apiService.get<MovieResponse>(`/movies/${id}`);
        return response.data;
    },
}