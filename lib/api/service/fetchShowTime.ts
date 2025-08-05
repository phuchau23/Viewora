'use client';

import apiService from "../core";
import { Seat } from "./fetchSeat";

export interface ShowTimeResponse {
  code: number;
  statusCode: string;
  message: string;
  data: ShowTime[]; 
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
  data: ShowTime[];
}

export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startTime: string; 
}
export interface RoomResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Room[];
}
export const ShowTimeService = {

    getShowTime: async (startDate: string, endDate: string): Promise<PaginatedShowTimeResponse> => {
        try {
          const res = await apiService.get<PaginatedShowTimeResponse>(`/showtimes/admin?startDate=${startDate}&endDate=${endDate}`);
          console.log("API result:", res);
          return res.data; 
        } catch (error) {
          throw error; 
        }
      },

      createShowtime: async (showtime: CreateShowtimeDto): Promise<ShowTimeResponse> => {
        try {
          const res = await apiService.post<ShowTimeResponse>(`/showtimes`, showtime);
          console.log(" API result:", res);
          return res.data; 
        } catch (error) {
          console.error("Failed to create showtime:", error);
          throw error; 
        }
      },
    getShowTimeByMovieId: async (movieId: string): Promise<ShowTime[]> => {
        try {
          const res = await apiService.get<ShowTimeResponse>(`/showtimes/movie/${movieId}`);
          console.log("API result:", res);
          return res.data.data; 
        } catch (error) {
          console.error("Failed to fetch showtime:", error);
          throw error; 
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
      },
    
      getShowtimesByBranchId: async (branchId: string): Promise<ShowTime[]> => {
        try {
          const roomsResponse = await apiService.get<RoomResponse>(`/rooms/branch/${branchId}`);
          const rooms = roomsResponse.data.data;
      
          const showtimeResults = await Promise.all(
            rooms.map(async (room) => {
              try {
                const res = await apiService.get<ShowTimeResponse>(`/showtimes/room/${room.id}`);
                return res.data.data || [];
              } catch {
                return [];
              }
            })
          );
      
          const allShowtimes = showtimeResults.flat();
      
          const validShowtimes = allShowtimes.filter(
            (s) =>
              !s.isExpired &&
              s.movie.isAvailable &&
              new Date(s.startTime) >= new Date()
          );
      
          return validShowtimes;
        } catch (error) {
          console.error("Error fetching showtimes by branch:", error);
          return [];
        }
      },
};