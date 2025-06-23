'use client';

import apiService from "../core";
import { Seat } from "./fetchSeat";

export interface ShowTimeResponse {
  code: number;
  statusCode: string;
  message: string;
  data: ShowTime[]; // 👈 Là mảng
}

export interface ShowTime {
  id: string;
  movie: Movie;
  room: Room;
  startTime: string;
  endTime: string;
  isExpired: boolean;
}

export interface Movie {
  id: string;
  name: string;
  description: string;
  director: string;
  actor: string;
  duration: number;
  rate: number;
  releaseDate: string;
  startShow: string;
  age: string;
  status: "inComing" | "nowShowing" | string;
  isAvailable: boolean;
  movieType: MovieType;
}

export interface MovieType {
  id: string;
  name: string;
  createdAt: string;
}

export interface Room {
  id: string;
  roomNumber: number;
  capacity: number;
  roomType: RoomType;
  branch: Branch;
}

export interface RoomType {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface PaginatedShowTimeResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: ShowTime[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startTime: string; // ISO 8601 format (e.g. "2025-06-17T13:16:14.009Z")
}

export const ShowTimeService = {

    getShowTime: async (): Promise<PaginatedShowTimeResponse> => {
        try {
          const res = await apiService.get<PaginatedShowTimeResponse>(`/showtimes`);
          console.log("API result:", res);
          return res.data; // hoặc return res nếu không phải Axios
        } catch (error) {
          console.error("Failed to fetch showtime:", error);
          throw error; // đẩy lỗi ra ngoài cho component xử lý
        }
      },

      createShowtime: async (showtime: CreateShowtimeDto): Promise<ShowTimeResponse> => {
        try {
          const res = await apiService.post<ShowTimeResponse>(`/showtimes`, showtime);
          console.log(" API result:", res);
          return res.data; // hoặc return res nếu không phải Axios
        } catch (error) {
          console.error("Failed to create showtime:", error);
          throw error; // đẩy lỗi ra ngoài cho component xử lý
        }
      },
    getShowTimeByMovieId: async (movieId: string): Promise<ShowTime[]> => {
        try {
          const res = await apiService.get<ShowTimeResponse>(`/showtimes/movie/${movieId}`);
          console.log("API result:", res);
          return res.data.data; // hoặc return res nếu không phải Axios
        } catch (error) {
          console.error("Failed to fetch showtime:", error);
          throw error; // đẩy lỗi ra ngoài cho component xử lý
        }
      },
      deleteShowtime: async (id: string): Promise<ShowTimeResponse> => {
        try {
          const res = await apiService.delete<ShowTimeResponse>(`/showtimes/${id}`);
          console.log("API result:", res);
          return res.data;
        } catch (error) {
          console.error("Failed to delete showtime:", error);
          throw error;
        }
      }};