"use client";

import { Seat, getSeatLabel, getSeatStyles } from "@/lib/data";
import "../../../globals.css";

interface SeatingChartProps {
  seats: Seat[];
  onSeatClick: (seatId: string) => void;
  room: "A" | "B" | "C" | "D" | "E" | "F";
}

export default function SeatingChart({
  seats,
  onSeatClick,
  room,
}: SeatingChartProps) {
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="bg-background rounded-xl shadow-md p-6 space-y-4">
      {/* SCREEN */}
      <div className="relative w-full flex justify-center mb-16">
        <div className="w-3/4 h-8 bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 rounded-t-full shadow-lg relative">
          <div className="absolute inset-0 rounded-t-full shadow-[0_0_40px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_40px_10px_rgba(255,255,255,0.1)] pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([row, rowSeats]) => {
          const isCoupleRow = rowSeats.some((seat) => seat.type === "couple");

          return (
            <div key={row} className="flex justify-center items-center gap-10">
              <span className="w-6 text-right text-slate-500 font-semibold">
                {row}
              </span>

              {isCoupleRow ? (
                <div className="flex justify-center gap-4">
                  {rowSeats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => onSeatClick(seat.id)}
                      disabled={seat.status === "occupied"}
                      className={getSeatStyles(seat)}
                      title={`Seat ${seat.id} - ${seat.type.toUpperCase()} - $${
                        seat.price
                      }`}
                    >
                      <span className="text-xs">{getSeatLabel(seat)}</span>
                    </button>
                  ))}
                </div>
              ) : room === "B" ? (
                <div className="grid grid-cols-[repeat(8,1fr)_0.5fr_repeat(2,1fr)] gap-1 items-center">
                  {rowSeats.slice(0, 8).map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => onSeatClick(seat.id)}
                      disabled={seat.status === "occupied"}
                      className={getSeatStyles(seat)}
                      title={`Seat ${seat.id} - ${seat.type.toUpperCase()} - $${
                        seat.price
                      }`}
                    >
                      <span className="text-xs">{getSeatLabel(seat)}</span>
                    </button>
                  ))}
                  <div /> {/* Khoảng cách giữa ghế 8 và 9 */}
                  {rowSeats.slice(8).map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => onSeatClick(seat.id)}
                      disabled={seat.status === "occupied"}
                      className={getSeatStyles(seat)}
                      title={`Seat ${seat.id} - ${seat.type.toUpperCase()} - $${
                        seat.price
                      }`}
                    >
                      <span className="text-xs">{getSeatLabel(seat)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${rowSeats.length}, minmax(0, 1fr))`,
                  }}
                >
                  {rowSeats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => onSeatClick(seat.id)}
                      disabled={seat.status === "occupied"}
                      className={getSeatStyles(seat)}
                      title={`Seat ${seat.id} - ${seat.type.toUpperCase()} - $${
                        seat.price
                      }`}
                    >
                      <span className="text-xs">{getSeatLabel(seat)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
