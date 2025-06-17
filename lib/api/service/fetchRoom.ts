import apiService from "../core";

export interface RoomResponse {
    code: number;
    statusCode: string;
    message: string;
    data: Room[];
  }
  
  export interface Room {
    id: string;
    roomNumber: number;
    capacity: number;
    status: string;
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
    totalRoom: number;
    address: string;
    phoneNumber: string;
    status: string;
    createdAt: string; // ISO date string
  }

  
export const RoomService = {
    getRoomsByBranchId: async (branchId: string) => {
        const response = await apiService.get<RoomResponse>(`/rooms/branch/${branchId}`);
        return response.data;
    }   
}