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
import { useSeatHoldingsQuery } from "@/hooks/useSeatHolding";
import { toast } from "@/hooks/use-toast";
interface Props {
  roomId: string;
  movie: Partial<Movies>;
  showtime: string; // ISO string datetime
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
function getSeatViolationReason(
  seats: Seat[],
  selectedSeats: string[],
  soldOrHeldSeatIds: Set<string>
): string | null {
  const selectedSet = new Set(selectedSeats);

  const groupedByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  for (const row of Object.values(groupedByRow)) {
    const sortedRow = row.sort((a, b) => a.number - b.number);

    for (let i = 0; i < sortedRow.length; i++) {
      const current = sortedRow[i];
      const left = sortedRow[i - 1];
      const right = sortedRow[i + 1];

      if (
        !selectedSet.has(current.id) &&
        !soldOrHeldSeatIds.has(current.id) &&
        left &&
        right &&
        (selectedSet.has(left.id) || soldOrHeldSeatIds.has(left.id)) &&
        (selectedSet.has(right.id) || soldOrHeldSeatIds.has(right.id))
      ) {
        return `Không được để trống 1 ghế ở giữa tại vị trí ${current.row}${current.number}`;
      }

      if (
        i === 0 &&
        !selectedSet.has(current.id) &&
        !soldOrHeldSeatIds.has(current.id) &&
        right &&
        selectedSet.has(right.id) &&
        !soldOrHeldSeatIds.has(right.id)
      ) {
        return `Không được để trống 1 ghế bên trái (vị trí đầu hàng ${current.row}${current.number})`;
      }

      if (
        i === sortedRow.length - 1 &&
        !selectedSet.has(current.id) &&
        !soldOrHeldSeatIds.has(current.id) &&
        left &&
        selectedSet.has(left.id) &&
        !soldOrHeldSeatIds.has(left.id)
      ) {
        return `Không được để trống 1 ghế bên phải (vị trí cuối hàng ${current.row}${current.number})`;
      }
    }
  }

  return null;
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
  const { data: seatHoldings } = useSeatHoldingsQuery(showtimeId);
  const soldOrHeldSeatIds = new Set(
    seatHoldings?.data
      ?.filter((h) => h.status === "Sold" || h.status === "Holding")
      .map((h) => h.seatId) ?? []
  );

  if (isLoading) return <div>Đang tải ghế...</div>;
  if (error || !seatsData) return <div>Lỗi khi tải ghế.</div>;

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
        toast({
          title: "Lỗi",
          description: "Bạn chưa chọn ghế. Vui lòng chọn ghế để tiếp tục",
          variant: "destructive",
        });
        return;
      }

      const violationReason = getSeatViolationReason(
        seats,
        selectedSeats,
        soldOrHeldSeatIds
      );
      if (violationReason) {
        toast({
          title: "Lỗi chọn ghế",
          description: violationReason,
          variant: "destructive",
        });
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
        showtimeId,
      };
      const res = await createBooking(bookingPayload);
      const paymentUrl = res.data.paymentUrl;
      if (paymentUrl) window.location.href = paymentUrl;
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
            Screen {roomNumber} - {showtime}
          </div>
          <div className="text-lg font-semibold mt-1">{movie.name}</div>
          <div className="text-xs mt-1">T18 · Phụ đề · 2D</div>
        </div>

        {step === "seat" ? (
          <SeatSelector
            showTimeId={showtimeId}
            seats={seats}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            seatHoldings={seatHoldings?.data ?? []}
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
