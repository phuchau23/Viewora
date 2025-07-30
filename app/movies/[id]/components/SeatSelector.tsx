"use client";

import { useMemo, useState } from "react";
import { Seat, seatType } from "@/lib/api/service/fetchSeat";
import { useSeatSignalR, HeldSeat, getUserIdFromToken } from "@/utils/signalr";
import { useTranslation } from "react-i18next";

interface Props {
  seats: Seat[];
  showTimeId: string;
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SeatSelector({
  seats,
  showTimeId,
  selectedSeats,
  setSelectedSeats,
}: Props) {
  const { t } = useTranslation();
  const userId = useMemo(() => getUserIdFromToken(), []);
  const [myHeldSeats, setMyHeldSeats] = useState<string[]>([]);
  const [othersHeldSeats, setOthersHeldSeats] = useState<string[]>([]);

  const { holdSeats, releaseSeat } = useSeatSignalR(
    showTimeId,
    (seatInfos) => {
      const myId = getUserIdFromToken();
      const validSeats = (seatInfos || []).filter(
        (s): s is HeldSeat =>
          s &&
          typeof s === "object" &&
          typeof s.seatId === "string" &&
          typeof s.heldBy === "string"
      );

      const mySeats = validSeats
        .filter((s) => s.heldBy === myId)
        .map((s) => s.seatId);
      setMyHeldSeats((prev) => Array.from(new Set([...prev, ...mySeats])));
      setOthersHeldSeats((prev) =>
        Array.from(
          new Set([
            ...prev,
            ...validSeats.filter((s) => s.heldBy !== myId).map((s) => s.seatId),
          ])
        )
      );
      setSelectedSeats((prev) => Array.from(new Set([...prev, ...mySeats])));
    },
    (releasedSeatIds) => {
      setMyHeldSeats((prev) =>
        prev.filter((id) => !releasedSeatIds.includes(id))
      );
      setOthersHeldSeats((prev) =>
        prev.filter((id) => !releasedSeatIds.includes(id))
      );
      setSelectedSeats((prev) =>
        prev.filter((id) => !releasedSeatIds.includes(id))
      );
    }
  );

  const toggleSeat = (seatId: string) => {
    if (othersHeldSeats.includes(seatId)) return;
    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        releaseSeat(seatId);
        return prev.filter((id) => id !== seatId);
      } else {
        holdSeats([seatId]);
        return [...prev, seatId];
      }
    });
  };

  const groupedByRow = useMemo(() => {
    return seats.reduce((acc: Record<string, Seat[]>, seat) => {
      acc[seat.row] = acc[seat.row] || [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [seats]);

  const getSeatColor = (seatId: string, type: string) => {
    if (selectedSeats.includes(seatId)) return "bg-yellow-500";
    if (othersHeldSeats.includes(seatId))
      return "bg-gray-400 cursor-not-allowed";
    if (type === seatType.vip) return "bg-red-400";
    if (type === seatType.couple) return "bg-pink-300";
    return "bg-blue-400";
  };

  return (
    <div className="text-center">
      <div className="text-center mb-4 font-bold">{t("screenLabel")}</div>
      <div className="flex flex-col gap-4 items-center">
        {Object.entries(groupedByRow)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-4">
              <span className="w-8 font-bold text-lg text-gray-700 dark:text-gray-300">
                {row}
              </span>
              <div className="flex gap-2 flex-wrap">
                {rowSeats
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const isCouple = seat.seatType.name === seatType.couple;
                    const seatColor = getSeatColor(seat.id, seat.seatType.name);

                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id)}
                        title={seat.seatType.name}
                        disabled={othersHeldSeats.includes(seat.id)}
                        className={`rounded-md border border-white font-semibold overflow-hidden
                          ${seatColor}
                          hover:brightness-110 hover:scale-105 transition-all duration-150
                          ${
                            isCouple ? "w-20" : "w-10"
                          } h-10 flex items-center justify-center text-sm`}
                      >
                        {isCouple ? "❤️" : seat.row + seat.number}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 flex justify-center gap-4 text-sm flex-wrap">
        <Legend color="bg-blue-400" label={t("normalSeat")} />
        <Legend color="bg-red-400" label={t("vipSeat")} />
        <Legend color="bg-pink-300" label={t("coupleSeat")} />
        <Legend color="bg-yellow-500" label={t("yourSelected")} />
        <Legend color="bg-gray-400" label={t("othersHeld")} />
      </div>
    </div>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);
