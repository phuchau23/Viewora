'use client';
import apiService from "../core";

export interface MovieType {
    id: string;
    name: string;
}

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
    movieTypes: MovieType[];
}
export interface MovieResponse {
    code: number;
    statusCode: string;
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

export interface MovieDeleteResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Movie;
}

export interface MovieUpdateRequest {
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

export interface MovieUpdateResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Movie;
}

export const MovieService = {
  getAllMovies: async (pageIndex = 1, pageSize = 20) => {
    const response = await apiService.get<MovieResponse>(
      `/movies?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response.data;
  },

  createMovie: async (formData: MovieCreateRequest) => {
    const response = await apiService.post<MovieCreateResponse>('/movies', formData);
    return response.data;
  },
  deleteMovie: async (id: string) => {
    const response = await apiService.delete<MovieResponse>(`/movies/${id}`);
    return response.data;
  },
  updateMovie: async (id: string, formData: FormData) => {
    const response = await apiService.put<MovieResponse>(
      `/movies/${id}`,
      formData
    );
    return response.data;
  },
  getMovieById: async (id: string) => {
    const response = await apiService.get<MovieResponse>(`/movies/${id}`);
    return response.data;
  },
};
