import path from "path";
import apiService from "../core";

export interface Types {
  id: string;
  name: string;
}

<<<<<<< 3cfffc032b9bc9dba5f509d0e500e2ef1591f548
export interface Movies {
  id: string;
  name: string;
  banner: string[]; // hoặc string nếu backend trả dạng chuỗi
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
  movieTypes: Types[];
=======
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
    movieTypes: MovieTypes[];
>>>>>>> 237e06b1371acf01156ad83f9c1114e948aeea1d
}

export interface MovieResponse {
  items: Movies[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface APIResponse<T> {
  code: number;
  statusCode: string;
  message: string;
  data: T;
}

export interface MovieRequest {
  Name: string;
  Description: string;
  Director: string;
  Actor: string;
  Duration: number;
  Rate: number;
  ReleaseDate: string;
  Trailer: string;
  StartShow: string;
  Age: string;
  MovieTypeNames: string[];
  Poster: File;
  Banner: File[];
}


export const MovieService = {
  // Lấy danh sách phim
  getAllMovies: async (pageIndex = 1, pageSize = 10) => {
    const response = await apiService.get<APIResponse<MovieResponse>>(`/movies`, {
      pageIndex,
      pageSize,
    });
    return response.data.data;
  },

  // Lấy chi tiết phim
  getMovieById: async (id: string) => {
    const response = await apiService.get<APIResponse<Movies>>(`/movies/`, {
      id,
    });
    return response.data.data;
  },

  // Tạo mới phim
  createMovie: async (data: FormData) => {
    const response = await apiService.post<APIResponse<Movies>>(
      "/movies",
      data
    );
    return response.data;
  },

  // Cập nhật phim
  updateMovie: async (id: string, data: FormData) => {
    const response = await apiService.put<APIResponse<Movies>>(
      `/movies/${id}`,
      data
    );
    return response.data;
  },

  // Xóa phim
  deleteMovie: async (id: string) => {
    const response = await apiService.delete<APIResponse<Movies>>(
      `/movies/${id}`
    );
    return response.data;
  },

  // Chuyển sang trạng thái đang chiếu
  playMovie: async (id: string) => {
    const response = await apiService.patch<APIResponse<Movies>>(
      `/movies/${id}/nowShowing`
    );
    return response.data;
  },

  // Chuyển sang trạng thái đã kết thúc
  stopMovie: async (id: string) => {
    const response = await apiService.patch<APIResponse<Movies>>(
      `/movies/${id}/ended`
    );
    return response.data;
  },
};
