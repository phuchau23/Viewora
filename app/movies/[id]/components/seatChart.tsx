"use client";

import React, { useState } from "react";
import { useSeatOfRoomByRoomId } from "@/hooks/useSeat";
import { Seat, seatType } from "@/lib/api/service/fetchSeat";

interface Props {
  roomId: string;
  movieTitle: string;
  showtime: string; // VD: "20:00 17/06/2025"
  roomNumber: number; // VD: "Phòng 2"
  branchName: string; // VD: "CGV Vincom Thủ Đức"
  onSeatClick?: (selectedSeats: Seat[]) => void;
}

export default function RoomSeatingChart({
  roomId,
  movieTitle,
  showtime,
  roomNumber,
  branchName,
  onSeatClick,
}: Props) {
  const { data, isLoading, error } = useSeatOfRoomByRoomId(roomId);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (isLoading)
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        Đang tải ghế...
      </div>
    );
  if (error || !data)
    return <div className="text-center text-red-500">Lỗi khi tải ghế.</div>;

  const seats: Seat[] = Array.isArray(data) ? data : [];

  const groupedByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      const updated = prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId];

      if (onSeatClick) {
        const selected = seats.filter((s) => updated.includes(s.id));
        onSeatClick(selected);
      }

      return updated;
    });
  };

  const getColor = (type: string, isSelected: boolean) => {
    if (type === seatType.vip)
      return isSelected ? "bg-red-800 text-white" : "bg-red-400 text-white";
    if (type === seatType.couple)
      return isSelected ? "bg-pink-800 text-white" : "bg-pink-300 text-white";
    return isSelected ? "bg-blue-800 text-white" : "bg-blue-400 text-white";
  };

  const selectedSeatObjects = seats.filter((s) => selectedSeats.includes(s.id));
  const totalPrice = selectedSeatObjects.reduce(
    (sum, s) => sum + (s.seatType.price || 0),
    0
  );

  return (
    <div className="p-6 bg-white dark:bg-[#1f1b1d] rounded-xl shadow-lg max-w-6xl mx-auto transition-colors duration-300 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột trái - sơ đồ chiếm 2/3 */}
      <div className="md:col-span-2">
        {/* Màn hình */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[60%] h-1.5 bg-black dark:bg-white rounded-full" />
          <span className="mt-2 text-sm tracking-wide font-semibold text-black dark:text-white">
            MÀN HÌNH
          </span>
        </div>

        {/* Ghế */}
        <div className="flex flex-col gap-4 items-center">
          {Object.entries(groupedByRow)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([row, seatsInRow]) => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-8 font-bold text-lg text-gray-700 dark:text-gray-300">
                  {row}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {seatsInRow
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      const seatColor = getColor(
                        seat.seatType.name,
                        isSelected
                      );
                      const isCouple = seat.seatType.name === seatType.couple;

                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id)}
                          className={`rounded-md border border-white font-semibold overflow-hidden
                            ${seatColor}
                            hover:brightness-110 hover:scale-105 transition-all duration-150
                            ${
                              isCouple ? "w-20" : "w-10"
                            } h-10 flex items-center justify-center text-sm`}
                          title={seat.seatType.name}
                        >
                          {isCouple ? "❤️" : seat.number}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        {/* Ghi chú */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-black dark:text-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-400" /> Ghế thường
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-400" /> Ghế VIP
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-pink-300" /> Ghế đôi
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-gray-300 bg-opacity-80 bg-black" />{" "}
            Đã chọn
          </div>
        </div>
      </div>

      {/* Cột phải - BILL */}
      {selectedSeats.length > 0 && (
        <div className="bg-gray-50 dark:bg-[#292326] rounded-xl p-4 shadow-md flex flex-col justify-between h-fit">
          {/* Thông tin phim */}
          <div className="text-sm text-gray-800 dark:text-gray-200 space-y-1 mb-4">
            <div>
              <span className="font-medium">Phim:</span> {movieTitle}
            </div>
            <div>
              <span className="font-medium">Suất chiếu:</span> {showtime}
            </div>
            <div>
              <span className="font-medium">Phòng:</span> {roomNumber}
            </div>
            <div>
              <span className="font-medium">Chi nhánh:</span> {branchName}
            </div>
          </div>

          {/* Danh sách vé */}
          <div className="flex flex-col gap-3">
            {selectedSeatObjects.map((seat) => (
              <div
                key={seat.id}
                className="text-sm flex justify-between items-center px-3 py-2 bg-white dark:bg-[#3a3235] rounded"
              >
                <span className="text-gray-700 dark:text-gray-200">
                  {seat.row + seat.number} – {seat.seatType.name}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {seat.seatType.price
                    ? `${seat.seatType.price.toLocaleString()}đ`
                    : "N/A"}
                </span>
              </div>
            ))}
          </div>

          {/* Tổng & Đặt vé */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center text-base font-semibold text-black dark:text-white mb-4">
              <span>Tổng:</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <button
              onClick={() => {
                onSeatClick?.(selectedSeatObjects);
                alert("Bạn đã chọn " + selectedSeats.length + " vé.");
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
            >
              Đặt vé
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
