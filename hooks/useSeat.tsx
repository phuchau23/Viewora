import { useQuery } from "@tanstack/react-query";
import { SeatService } from "@/lib/api/service/fetchSeat";
import { Seat } from "@/lib/api/service/fetchSeat";

export const useSeatOfRoomByRoomId = (roomId: string) => {
  const { data, isLoading, error } = useQuery<Seat[]>({
    queryKey: ["seat", roomId],
    queryFn: () => SeatService.getSeatOfRoomByRoomId(roomId),
    enabled: !!roomId,
  });

  return {
    data,
    isLoading,
    error,
  };
};
