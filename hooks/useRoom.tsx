"use client";
import { useQuery } from "@tanstack/react-query";
import { RoomService } from "@/lib/api/service/fetchRoom";

export const useRooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => RoomService.getAllRooms(),
  });

  return {
    rooms: data?.data || [],
    isLoading,
    error,
  };
};

export const useRoomByBranchId = (branchId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms", branchId],
    queryFn: () => RoomService.getRoomsByBranchId(branchId),
  });

  return {
    rooms: data?.data || [],
    isLoading,
    error,
  };
};
