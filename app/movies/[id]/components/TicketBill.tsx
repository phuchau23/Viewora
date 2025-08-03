"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Seat } from "@/lib/api/service/fetchSeat";
import { Clock, MapPin, Monitor, X } from "lucide-react";
import PromoCodeSelector from "./Promotionbooking";
import { Snack } from "@/lib/api/service/fetchSnack";
import { Promotion } from "@/lib/api/service/fetchPromotion";
import { Movies } from "@/lib/api/service/fetchMovies";
import { useTranslation } from "react-i18next";

interface Props {
  movie: Partial<Movies>;
  showtime: string;
  roomNumber: number;
  branchName: string;
  selectedSeats: Seat[];
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
  const { t } = useTranslation();
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [finalPrice, setFinalPrice] = useState(0);
  const [promotionError, setPromotionError] = useState<React.ReactNode>("");
  const [countdown, setCountdown] = useState(5 * 60); // 5 phút (tính bằng giây)

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

  const applyDiscount = () => {
    setPromotionError("");
    if (!selectedPromotion) {
      setFinalPrice(originalTotal);
      return;
    }

    if (originalTotal < selectedPromotion.minOrderValue) {
      setFinalPrice(originalTotal);
      setPromotionError(
        <>
          Đơn hàng cần tối thiểu{" "}
          <strong>{selectedPromotion.minOrderValue.toLocaleString()}đ</strong>{" "}
          để áp dụng mã <strong>{selectedPromotion.code}</strong>
        </>
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
    if (countdown <= 0) {
      console.log("Hết thời gian thanh toán");
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    applyDiscount();
  }, [originalTotal, selectedPromotion]);

  return (
    <div className="h-auto">
      <div className="flex flex-col h-auto p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-800">
        <h1 className="text-2xl md:text-2xl font-extrabold text-center mb-4 text-orange-600">
          {t("orderTitle")}
        </h1>

        {/* Thông tin phim */}
        <div className="mb-4 pb-4 border-b border-spacing-1 border-gray-300">
          <div className="flex text-xl font-extrabold mb-1 gap-3 pb-4">
            <span className="">{movie.name?.toUpperCase()}</span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <MapPin className="w-6 h-6 font-mono" />
            <span className="font-mono">{branchName.toUpperCase()}</span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <Clock className="w-6 h-6 font-mono" />
            <span className="font-mono">{showtime}</span>
          </div>
          <div className="flex text-base mb-1 gap-3">
            <Monitor className="w-6 h-6 font-mono" />
            <span className="font-mono">Screen {roomNumber}</span>
          </div>
        </div>

        {/* Step seat */}
        {step === "seat" && (
          <>
            {selectedSeats.length === 0 ? (
              <div className="my-4 p-3 border-2 border-red-500 rounded-md bg-red-50 text-red-700 text-center text-sm font-medium">
                {t("noSeatSelected")}
              </div>
            ) : (
              <>
                <p className="text-base font-semibold mb-2">Ghế đã chọn:</p>
                {selectedSeats.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm mb-1">
                    <span className="">
                      {s.row + s.number} -{" "}
                      {s.seatType?.name || "Không rõ loại ghế"}
                    </span>
                    <span className="font-medium">
                      {s.seatType?.prices
                        ?.find((p) => p.timeInDay === "Morning")
                        ?.amount?.toLocaleString() || "0"}{" "}
                      đ
                    </span>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* Step combo */}
        {step === "combo" && (
          <div className="mb-4 space-y-4">
            <div>
              <p className="text-base font-semibold mb-2">Combo đã chọn:</p>
              {selectedCombos.length > 0 ? (
                <div className="space-y-2">
                  {selectedCombos.map((c) => (
                    <div
                      key={c.id}
                      className="flex justify-between text-sm border-b border-gray-100 pb-1"
                    >
                      <span className="">
                        {c.name} × {c.quantity}
                      </span>
                      <span className="font-medium">
                        {(c.price * (c.quantity || 0)).toLocaleString()} đ
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-500 border border-dashed border-gray-300 rounded-md">
                  Chưa chọn combo nào. Bạn có thể bỏ qua hoặc chọn để được
                  khuyến mãi tốt hơn
                </div>
              )}
            </div>

            {/* Promo Section */}
            <div className="pt-4 border-t border-gray-300">
              <label
                htmlFor="promotionCode"
                className="text-base font-semibold mb-2"
              >
                {t("promoCode")}
              </label>

              <PromoCodeSelector
                selectedCode={promotionCode}
                totalPrice={originalTotal}
                onSelect={(promo) => {
                  const isCleared = !promo.code;
                  setPromotionCode(promo.code ?? "");
                  setSelectedPromotion(isCleared ? null : (promo as Promotion));
                  if (isCleared) {
                    setFinalPrice(originalTotal);
                    setPromotionError("");
                  }
                }}
              />

              {promotionError && (
                <div className="flex items-center text-sm text-yellow-500 mt-2">
                  <p>{promotionError}</p>
                </div>
              )}

              {selectedPromotion && finalPrice !== originalTotal && (
                <div className="mt-3 flex items-center justify-between bg-red-50 border border-red-300 text-red-800 px-3 py-2 rounded-md">
                  <p className="text-sm">
                    {t("promoApplied", {
                      code: selectedPromotion.code,
                      amount: (originalTotal - finalPrice).toLocaleString(),
                    })}
                  </p>
                  <button
                    className="ml-4 text-red-600 text-sm underline"
                    onClick={() => {
                      setPromotionCode("");
                      setSelectedPromotion(null);
                      setFinalPrice(originalTotal);
                      setPromotionError("");
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step payment */}
        {step === "payment" && (
          <>
            <div className="text-sm mb-4">
              <p className="mb-2">Bạn đã sẵn sàng thanh toán.</p>
              <p>Phương thức thanh toán được chọn ở bên trái.</p>
            </div>
          </>
        )}

        {/* Tổng tiền + nút điều hướng */}
        <div className="mt-4 pt-4 border-t border-spacing-1 border-gray-300">
          <div className="space-y-2 mb-4">
            {/* Tạm tính */}
            <div className="flex justify-between text-sm">
              <span>Tổng tiền:</span>
              <span>{originalTotal.toLocaleString()} đ</span>
            </div>

            {selectedPromotion && finalPrice !== originalTotal && (
              <div className="flex justify-between text-sm text-red-700">
                <span>{t("discountAmount")}</span>
                <span>- {(originalTotal - finalPrice).toLocaleString()} đ</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="text-lg md:text-xl font-bold text-gray-800">
                {t("subtotal")}
              </span>
              <span className="text-xl md:text-2xl font-bold text-orange-600">
                {finalPrice.toLocaleString()} đ
              </span>
            </div>
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
              ? t("nextToCombo")
              : step === "combo"
              ? t("confirmPayment")
              : t("bookTicket")}
          </button>

          {(step === "combo" || step === "payment") && (
            <button
              onClick={handleBack}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors duration-200 text-base shadow-sm"
            >
              &larr; {t("back")}
            </button>
          )}
        </div>
        <div className="mt-4 text-center text-base font-medium text-gray-600">
          Còn lại:{" "}
          <span className="text-lg font-extrabold text-red-600">
            {Math.floor(countdown / 60)}:
            {(countdown % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
