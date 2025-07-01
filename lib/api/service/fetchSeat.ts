import apiService from "../core";

export interface SeatApiResponse {
  code: number;
  statusCode: string
  message: string;
  data: Seat[];
}

export interface Seat{
    id: string 
    row: string
    number: number
    seatType :{
        id: string
        name: seatType
        prices : Prices[]
    } 
    room: Room
}

export interface Prices {
    id: string;
    timeInDay: "Morning" | "Night"; 
    amount: number;
  }

export enum seatType {
    standard = "Standard Seat",
    vip = "VIP Seat",
    couple = "Couple Seat"
}

export interface Room{
    id: string
    roomNumber: number
    capacity: number
    status: string
    roomType:{
        id: string
        name: string
    }
    branch: Branch
}

export interface Branch{
    id: string
    name: string
    totalRoom: number
    phoneNumber: string
    address: string
    status: string
    createdAt: string
}

export const SeatService = {
    getSeatOfRoomByRoomId: async (roomId: string) => {
      const response = await apiService.get<SeatApiResponse>(`/seats/room/${roomId}/row`);
      return response.data.data; // 👈 lấy đúng mảng ghế
    }
  };