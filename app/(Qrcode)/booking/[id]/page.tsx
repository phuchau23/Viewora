"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useBookingById } from "@/hooks/useBooking";

const Booking = ({ params }: { params: { id: string } }) => {
  const booking = useBookingById(params.id);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [posterError, setPosterError] = useState(false);

  // const posterUrl = !posterError
  //   ? booking.booking?.showTime.movie.posterUrl
  //   : undefined;

  return (
    <div className="min-h-screen bg-orange-200 px-4 py-6 text-sm text-gray-800">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">
        {/* Header */}
        <div className="bg-orange-500 text-white text-lg px-4 py-3 text-center font-semibold">
          Thông tin vé xem phim
        </div>

        <div className="bg-orange-50">
          {/* Movie section */}
          <div className="p-4">
            <div className="font-bold text-base">
              {booking.booking?.showTime.movie.name}
            </div>
            <div className="text-xs text-gray-600">2D Phụ đề</div>
            <div className="mt-3">
              <Image
                src={
                  "https://i.ytimg.com/vi/_v3IxO84IUk/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgZShlMA8=&rs=AOn4CLBXVvvhQEIlQEs_i3Cqmd_DfJP7Ow"
                }
                width={600}
                height={300}
                alt="movie"
                className="rounded-md object-cover w-full h-40"
                onError={() => setPosterError(true)}
              />
            </div>
          </div>

          {/* QR + info */}
          <div className="px-4 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Mã đặt vé:</div>
                <div className="text-xl font-bold">556475</div>
                <div className="mt-1 text-sm text-gray-500">Thời gian:</div>
                <div className="text-orange-600 font-semibold">
                  22:15 - 00:26
                </div>
                <div className="text-sm">CN, 11/05/2025</div>
              </div>

              {/* QR code clickable */}
              <div>
                <img
                  src={`data:image/png;base64,${booking.booking?.qrCodeUrl}`}
                  alt="QR Code"
                  width={100}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setQRModalOpen(true)}
                />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Đây là thông tin chi tiết của vé bạn đã mua
            </div>
          </div>

          {/* Rạp chiếu */}
          <div className="px-4 py-3 border-t text-sm space-y-1 relative">
            <div className="flex justify-between font-medium">
              <span>Phòng chiếu</span>
              <span>{booking.booking?.showTime.branch.room.roomNumber}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Số vé</span>
              <span>
                {booking.booking?.seats.length.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Số ghế</span>
              <span>
                {booking.booking?.seats
                  .map((s) => `${s.row}${s.number}`)
                  .join(", ")}
              </span>
            </div>
            <div className="mt-2">
              <div className="font-semibold">
                {booking.booking?.showTime.branch.name}
              </div>
              <div className="text-xs text-gray-500">
                {booking.booking?.showTime.branch.address}
              </div>
            </div>
            <div className="absolute rotate-[-20deg] text-orange-500 text-2xl font-bold right-3 top-3 opacity-40">
              VÉ ĐÃ XÁC THỰC
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR */}
      {isQRModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setQRModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-xl shadow-lg max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`data:image/png;base64,${booking.booking?.qrCodeUrl}`}
              alt="QR Code Large"
              className="w-full h-auto object-contain"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              Bấm ra ngoài để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
