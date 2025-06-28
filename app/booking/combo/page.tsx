"use client";
import { useSearchParams } from "next/navigation";

export default function ComboPage() {
  const params = useSearchParams();

  const seatIds = params.get("seats")?.split(",") || [];
  const movieTitle = params.get("movieTitle") || "";
  const showtime = params.get("showtime") || "";
  const room = params.get("room") || "";
  const branch = params.get("branch") || "";

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chọn Combo</h1>

      <div className="bg-white p-4 rounded shadow-md space-y-2">
        <p><strong>Phim:</strong> {movieTitle}</p>
        <p><strong>Suất chiếu:</strong> {showtime}</p>
        <p><strong>Phòng:</strong> {room}</p>
        <p><strong>Chi nhánh:</strong> {branch}</p>
        <p><strong>Ghế đã chọn:</strong> {seatIds.join(", ")}</p>
      </div>

      {/* Giao diện chọn combo ở đây */}
    </div>
  );
}
