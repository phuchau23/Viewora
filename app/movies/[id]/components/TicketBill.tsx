"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Seat } from "@/lib/api/service/fetchSeat";
import { Clock, Monitor } from "lucide-react";
import PromoCodeSelector from "./Promotionbooking";
import { Snack } from "@/lib/api/service/fetchSnack";
import { Promotion } from "@/lib/api/service/fetchPromotion";
import { Movies } from "@/lib/api/service/fetchMovies";
import PaymentLayout from "@/app/payment/page";

interface Props {
  movie: Partial<Movies>;
  showtime: string;
  roomNumber: number;
  branchName: string;
  selectedSeats: Seat[]; // ✅ Đã đảm bảo là Seat[]
  selectedCombos: Snack[];
  promotionCode: string;
  setPromotionCode: (code: string) => void;
  step: "seat" | "combo" | "payment";
  handleNext: () => void;
  handleBack: () => void;
}

export default function TicketBill({
  movie,
  showtime,
  roomNumber,
  branchName,
  selectedSeats,
  selectedCombos,
  promotionCode,
  setPromotionCode,
  step,
  handleNext,
  handleBack,
}: Props) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [finalPrice, setFinalPrice] = useState(0);
  const [promotionError, setPromotionError] = useState("");

  // ✅ Tính tổng ghế + combo
  const originalTotal = useMemo(() => {
    const seatTotal = selectedSeats.reduce(
      (acc, s) =>
        acc +
        (s.seatType.prices.find((p) => p.timeInDay === "Morning")?.amount || 0),
      0
    );
    const comboTotal = selectedCombos.reduce(
      (acc, c) => acc + c.price * (c.quantity || 0),
      0
    );
    return seatTotal + comboTotal;
  }, [selectedSeats, selectedCombos]);

  // ✅ Tính giảm giá
  const applyDiscount = () => {
    setPromotionError("");
    if (!selectedPromotion) {
      setFinalPrice(originalTotal);
      return;
    }

    if (originalTotal < selectedPromotion.minOrderValue) {
      setFinalPrice(originalTotal);
      setPromotionError(
        `Đơn hàng cần tối thiểu ${selectedPromotion.minOrderValue.toLocaleString()}đ để áp dụng mã ${
          selectedPromotion.code
        }`
      );
      return;
    }

    let discountAmount = 0;
    if (selectedPromotion.discountTypeEnum === "Fixed") {
      discountAmount = selectedPromotion.discountPrice;
    } else {
      discountAmount = (originalTotal * selectedPromotion.discountPrice) / 100;
      if (
        selectedPromotion.maxDiscountValue &&
        discountAmount > selectedPromotion.maxDiscountValue
      ) {
        discountAmount = selectedPromotion.maxDiscountValue;
      }
    }

    const final = originalTotal - discountAmount;
    setFinalPrice(final > 0 ? final : 0);
  };

  useEffect(() => {
    applyDiscount();
  }, [originalTotal, selectedPromotion]);

  return (
    <div className="h-auto">
      <div className="flex flex-col h-auto p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-sm md:text-base font-extrabold text-center mb-4 text-orange-600">
          {step === "seat" ? "THÔNG TIN GHẾ" : "THÔNG TIN COMBO"}
        </h1>

        {/* Thông tin phim */}
        <div className="mb-4 pb-4 border-b border-spacing-1 border-gray-300">
          <div className="flex text-2xl font-extrabold mb-1 gap-3">
            <span className="text-foreground">{branchName.toUpperCase()}</span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <span className="text-foreground font-mono">
              {movie.name?.toUpperCase()}
            </span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <Clock className="w-6 h-6 text-foreground font-mono" />
            <span className="text-gray-900 font-mono">{showtime}</span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <Monitor className="w-6 h-6 text-foreground font-mono" />
            <span className="text-gray-900 font-mono">Screen {roomNumber}</span>
          </div>
        </div>

        {/* Step seat */}
        {step === "seat" && (
          <>
            {selectedSeats.length === 0 ? (
              <div className="my-4 p-3 border-2 border-red-500 rounded-md bg-red-50 text-red-700 text-center text-sm font-medium">
                Bạn chưa chọn ghế nào. Vui lòng chọn ghế.
              </div>
            ) : (
              <>
                <p className="text-base font-semibold mb-2 text-gray-800">Ghế đã chọn:</p>
                {selectedSeats.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      {s.row + s.number} - {s.seatType.name}
                    </span>
                    <span className="font-medium text-gray-800">
                      {s.seatType.prices.find((p) => p.timeInDay === "Morning")?.amount.toLocaleString()}đ
                    </span>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* Danh sách combo */}
        {step === "combo" && (
          <div className="mb-4 pt-4 pb-4 border-t border-spacing-1 border-gray-300">
            <p className="text-base font-semibold mb-2 text-gray-800">
              Combo đã chọn:
            </p>
            {selectedCombos.length > 0 ? (
              selectedCombos.map((c) => (
                <div key={c.id} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">
                    {c.name} x {c.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    {(c.price * (c.quantity || 0)).toLocaleString()}đ
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Chưa chọn combo nào.</p>
            )}
            <div className="mt-4 pt-4 border-t border-spacing-1 border-gray-300">
              <label
                htmlFor="promotionCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mã giảm giá:
              </label>
              <PromoCodeSelector
                selectedCode={promotionCode}
                totalPrice={originalTotal}
                onSelect={(promo) => {
                  setPromotionCode(promo.code ?? "");
                  setSelectedPromotion(promo as Promotion);
                }}
              />
              {promotionError && (
                <p className="text-sm text-red-600 mt-2">{promotionError}</p>
              )}
              {selectedPromotion && finalPrice !== originalTotal && (
                <p className="text-sm text-green-600 font-medium mt-2">
                  Đã áp dụng mã <strong>{selectedPromotion.code}</strong> – Giảm{" "}
                  {(originalTotal - finalPrice).toLocaleString()}đ
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step payment */}
        {step === "payment" && (
          <div className="text-sm text-gray-700 mb-4">
            <p className="mb-2">Bạn đã sẵn sàng thanh toán.</p>
            <p>Phương thức thanh toán được chọn ở bên trái.</p>
          </div>
        )}

        {/* Tổng tiền + nút điều hướng */}
        <div className="mt-4 pt-4 border-t border-spacing-1 border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg md:text-xl font-bold text-gray-800">
              Tổng cộng:
            </span>
            <span className="text-xl md:text-2xl font-bold text-orange-600">
              {finalPrice?.toLocaleString()}đ
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedSeats.length === 0 && step === "seat"}
            className={`w-full py-3 rounded-lg text-base font-semibold shadow-md ${
              selectedSeats.length === 0 && step === "seat"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
            }`}
          >
            {step === "seat"
              ? "Tiếp tục chọn combo"
              : step === "combo"
              ? "Xác nhận thanh toán"
              : "Đặt vé"}
          </button>
          {step === "combo" && (
            <button
              onClick={handleBack}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors duration-200 text-base shadow-sm"
            >
              &larr; Trở lại chọn ghế
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
