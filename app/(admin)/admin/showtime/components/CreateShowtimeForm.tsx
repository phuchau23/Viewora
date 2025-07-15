"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { useMovies } from "@/hooks/useMovie";
import { useBranch } from "@/hooks/useBranch";
import { useRoomByBranchId } from "@/hooks/useRoom";
import { useCreateShowTime } from "@/hooks/useShowTime";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateShowtimeDto } from "@/lib/api/service/fetchShowTime";

export default function CreateShowtimeForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { movies } = useMovies();
  const { branches } = useBranch();
  const [branchId, setBranchId] = useState<string | undefined>(undefined);
  const { rooms, isLoading: isLoadingRooms } = useRoomByBranchId(
    branchId || ""
  );

  const { mutateAsync: createShowTime, error: createShowTimeError } =
    useCreateShowTime();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateShowtimeDto>();


  const onSubmit = async (data: CreateShowtimeDto) => {
    const formattedStart = format(
      new Date(data.startTime),
      "yyyy-MM-dd HH:mm:ss"
    );

    const payload = {
      ...data,
      startTime: formattedStart,
    };

    try {
      await createShowTime(payload);
      onSuccess?.();
    } catch (err: any) {
      const rawMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Tạo suất chiếu thất bại";
      const cleanedMessage = rawMessage.replace(/^Error:\s*/, "");

      // toast.error(`❌ ${cleanedMessage}`);
      // console.error("Lỗi tạo suất chiếu:", err);
      window.alert(cleanedMessage);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Movie selection */}
      <div className="space-y-1">
        <Label htmlFor="movieId">🎬 Phim</Label>
        <select
          {...register("movieId", { required: "Vui lòng chọn phim" })}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">-- Chọn phim --</option>
          {movies?.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.name}
            </option>
          ))}
        </select>
        {errors.movieId && (
          <p className="text-sm text-red-500">{errors.movieId.message}</p>
        )}
      </div>

      {/* Branch selection */}
      <div className="space-y-1">
        <Label htmlFor="branchId">🏢 Chi nhánh</Label>
        <select
          value={branchId || ""}
          onChange={(e) => {
            setBranchId(e.target.value || undefined);
            setValue("roomId", ""); // reset phòng nếu đổi chi nhánh
          }}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">-- Chọn chi nhánh --</option>
          {branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Room selection */}
      <div className="space-y-1">
        <Label htmlFor="roomId">📽️ Phòng chiếu</Label>
        <select
          {...register("roomId", { required: "Vui lòng chọn phòng" })}
          disabled={!branchId || isLoadingRooms}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white disabled:opacity-50"
        >
          <option value="">-- Chọn phòng --</option>
          {rooms?.map((room) => (
            <option key={room.id} value={room.id}>
              Phòng {room.roomNumber} • {room.roomType?.name}
            </option>
          ))}
        </select>
        {errors.roomId && (
          <p className="text-sm text-red-500">{errors.roomId.message}</p>
        )}
      </div>

      {/* Start time */}
      <div className="space-y-1">
        <Label htmlFor="startTime">🕒 Thời gian bắt đầu</Label>
        <Input
          type="datetime-local"
          {...register("startTime", { required: "Vui lòng chọn thời gian" })}
          className="dark:text-white"
        />
        {errors.startTime && (
          <p className="text-sm text-red-500">{errors.startTime.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" className="w-full">
          Tạo suất chiếu
        </Button>
      </div>
    </form>
  );
}
