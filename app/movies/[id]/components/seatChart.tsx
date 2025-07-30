"use client";

import React, { useState } from "react";
import { useSeatOfRoomByRoomId } from "@/hooks/useSeat";
import { Seat } from "@/lib/api/service/fetchSeat";
import { useRouter } from "next/navigation";
import SeatSelector from "./SeatSelector";
import ComboSelector from "./ComboSelector";
import TicketBill from "./TicketBill";
import { Movies } from "@/lib/api/service/fetchMovies";
import { Snack } from "@/lib/api/service/fetchSnack";
import { useSnacks } from "@/hooks/useSnacks";
import { useBooking } from "@/hooks/useBooking";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useTranslation } from "react-i18next";

interface Props {
  roomId: string;
  movie: Partial<Movies>;
  showtime: string;
  showtimeId: string;
  roomNumber: number;
  branchName: string;
  onSeatClick?: (selectedSeats: Seat[]) => void;
}

function getSeatPriceByShowtime(seat: Seat, startTime: string): number {
  const date = new Date(startTime);
  const hourVN = date.getUTCHours() + 7;
  const hour = hourVN >= 24 ? hourVN - 24 : hourVN;

  const timeInDay: "Morning" | "Night" =
    hour >= 6 && hour < 22 ? "Morning" : "Night";

  const price = seat.seatType?.prices.find((p) => p.timeInDay === timeInDay);
  return price?.amount || 0;
}

export default function RoomSeatingChart({
  roomId,
  movie,
  showtime,
  showtimeId,
  roomNumber,
  branchName,
  onSeatClick,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: seatsData, isLoading, error } = useSeatOfRoomByRoomId(roomId);
  const { data: snackRawData } = useSnacks();
  const { createBooking } = useBooking();

  const availableCombos: Snack[] = snackRawData?.snacks ?? [];

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Snack[]>([]);
  const [step, setStep] = useState<"seat" | "combo" | "payment">("seat");
  const [promotionCode, setPromotionCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "momo" | null>(
    null
  );

  if (isLoading) return <div>{t("loadingSeats")}</div>;
  if (error || !seatsData) return <div>{t("errorSeats")}</div>;

  const seats: Seat[] = Array.isArray(seatsData) ? seatsData : [];
  const selectedSeatObjects = seats.filter((s) => selectedSeats.includes(s.id));

  const totalSeatPrice = selectedSeatObjects.reduce(
    (sum, seat) => sum + getSeatPriceByShowtime(seat, showtime),
    0
  );

  const totalComboPrice = selectedCombos.reduce(
    (sum, c) => sum + c.price * (c.quantity || 0),
    0
  );

  const finalPrice = totalSeatPrice + totalComboPrice - discountAmount;

  const updateComboQuantity = (combo: Snack, quantity: number) => {
    setSelectedCombos((prev) => {
      if (quantity <= 0) return prev.filter((c) => c.id !== combo.id);
      const exists = prev.find((c) => c.id === combo.id);
      if (exists) {
        return prev.map((c) => (c.id === combo.id ? { ...c, quantity } : c));
      } else {
        return [...prev, { ...combo, quantity }];
      }
    });
  };

  const handleNext = async () => {
    if (step === "seat") {
      if (selectedSeatObjects.length === 0) {
        alert(t("noSeatSelected"));
        return;
      }
      onSeatClick?.(selectedSeatObjects);
      setStep("combo");
    } else if (step === "combo") {
      setStep("payment");
    } else if (step === "payment") {
      const bookingPayload = {
        seatIds: selectedSeatObjects.map((s) => s.id),
        snackSelection: selectedCombos.map((c) => ({
          snackId: c.id,
          quantity: c.quantity || 0,
        })),
        promotionCode,
        paymentMethod: paymentMethod?.toLocaleUpperCase() || "",
        showtimeId: showtimeId,
      };
      const res = await createBooking(bookingPayload);
      const paymentUrl = res.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    }
  };

  const handleBack = () => {
    if (step === "combo") {
      setStep("seat");
    } else if (step === "payment") {
      setStep("combo");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="font-bold text-base">{branchName}</div>
          <div>
            {t("screen")} {roomNumber} - {showtime}
          </div>
          <div className="text-lg font-semibold mt-1">{movie.name}</div>
          <div className="text-xs mt-1">
            {t("age")} · {t("subtitle")} · {t("2d")}
          </div>
        </div>

        {step === "seat" ? (
          <SeatSelector
            showTimeId={showtimeId}
            seats={seats}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
          />
        ) : step === "combo" ? (
          <ComboSelector
            availableCombos={availableCombos}
            selectedCombos={selectedCombos}
            updateComboQuantity={updateComboQuantity}
          />
        ) : (
          step === "payment" && (
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          )
        )}
      </div>
      <TicketBill
        movie={movie}
        showtime={showtime}
        roomNumber={roomNumber}
        branchName={branchName}
        selectedSeats={selectedSeatObjects}
        selectedCombos={selectedCombos}
        promotionCode={promotionCode}
        setPromotionCode={setPromotionCode}
        step={step}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </div>
  );
}
