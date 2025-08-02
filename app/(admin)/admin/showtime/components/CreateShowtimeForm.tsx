"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { format, addDays, setHours, setMinutes } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMovies } from "@/hooks/useMovie";
import { useBranch } from "@/hooks/useBranch";
import { useRoomByBranchId } from "@/hooks/useRoom";
import { useCreateShowTime } from "@/hooks/useShowTime";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateShowtimeDto } from "@/lib/api/service/fetchShowTime";
import { useTranslation } from "react-i18next";

export default function CreateShowtimeForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const { movies } = useMovies();
  const { branches } = useBranch();
  const [branchId, setBranchId] = useState<string | undefined>(undefined);
  const { rooms, isLoading: isLoadingRooms } = useRoomByBranchId(
    branchId || ""
  );

  const { mutateAsync: createShowTime } = useCreateShowTime();

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
        err?.response?.data?.message || err?.message || t("createError");
      const cleanedMessage = rawMessage.replace(/^Error:\s*/, "");
      window.alert(cleanedMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Movie selection */}
      <div className="space-y-1">
        <Label htmlFor="movieId">{t("movieLabel")}</Label>
        <select
          {...register("movieId", { required: "Vui lòng chọn phim" })}
          className="w-full px-3 py-2 border rounded-md "
        >
          <option value="">-- Chọn phim --</option>

          {/* Phim đang chiếu */}
          <optgroup label="🎬 Đang chiếu (Now Showing)">
            {movies
              ?.filter((movie) => movie.status === "nowShowing")
              .map((movie) => (
                <option key={movie.id} value={movie.id}>
                 - {movie.name}
                </option>
              ))}
          </optgroup>

          {/* Phim sắp chiếu */}
          <optgroup label="🚀 Sắp chiếu (Incoming)">
            {movies
              ?.filter((movie) => movie.status === "incoming")
              .map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.name}
                </option>
              ))}
          </optgroup>
        </select>

        {errors.movieId && (
          <p className="text-sm text-red-500">{errors.movieId.message}</p>
        )}
      </div>

      {/* Branch selection */}
      <div className="space-y-1">
        <Label htmlFor="branchId">{t("branchLabel")}</Label>
        <select
          value={branchId || ""}
          onChange={(e) => {
            setBranchId(e.target.value || undefined);
            setValue("roomId", ""); // reset phòng nếu đổi chi nhánh
          }}
          className="w-full px-3 py-2 border rounded-md "
        >
          <option value="">{t("branchPlaceholder")}</option>
          {branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Room selection */}
      <div className="space-y-1">
        <Label htmlFor="roomId">{t("roomLabel")}</Label>
        <select
          {...register("roomId", { required: t("roomRequired") })}
          disabled={!branchId || isLoadingRooms}
          className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
        >
          <option value="">{t("roomPlaceholder")}</option>
          {rooms?.map((room) => (
            <option key={room.id} value={room.id}>
              {t("roomOption", {
                room: room.roomNumber,
                type: room.roomType?.name,
              })}
            </option>
          ))}
        </select>
        {errors.roomId && (
          <p className="text-sm text-red-500">{errors.roomId.message}</p>
        )}
      </div>

      {/* Start time */}
      {/* Start time */}
      <div className="space-y-1">
        <Label htmlFor="startTime">🕒 Thời gian bắt đầu</Label>
        <div className="w-full">
          <DatePicker
            selected={watch("startTime") ? new Date(watch("startTime")) : null}
            onChange={(date: Date | null) => {
              if (date)
                setValue("startTime", format(date, "yyyy-MM-dd HH:mm:ss"));
            }}
            showTimeSelect
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            minDate={new Date()}
            maxDate={addDays(new Date(), 14)}
            minTime={setHours(setMinutes(new Date(), 0), 8)}
            maxTime={setHours(setMinutes(new Date(), 0), 22)}
            className="w-full px-3 py-2 border rounded-md "
            placeholderText="dd/MM/yyyy HH:mm"
          />
        </div>
        {errors.startTime && (
          <p className="text-sm text-red-500">{errors.startTime.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" className="w-full">
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
