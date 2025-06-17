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
  basePrice: number;
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



export const ShowTimeService = {
    getShowTimeByMovieId: async (movieId: string): Promise<ShowTime[]> => {
        try {
          const res = await apiService.get<ShowTimeResponse>(`/showtimes/movie/${movieId}`);
          console.log("✅ API result:", res);
          return res.data.data; // hoặc return res nếu không phải Axios
        } catch (err) {
          console.error("❌ Failed to fetch showtime:", err);
          throw err; // đẩy lỗi ra ngoài cho component xử lý
        }
      },
    };