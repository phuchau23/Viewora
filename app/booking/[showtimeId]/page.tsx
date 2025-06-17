// app/booking/[showtimeId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  roomConfigurations,
  sampleShowtimes,
  Seat,
  Showtime,
} from "@/lib/data";
import SeatingChart from "./components/seattingChart";
import MovieDetails from "./components/movieDetail";
import BookingSummary from "./components/bookingSummary";

export default function BookingPage({
  params,
}: {
  params: { showtimeId?: string };
}) {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    console.log("params:", params); // Debug: Log entire params object
    if (!params.showtimeId) {
      console.error("showtimeId is undefined");
      notFound();
    }

    const foundShowtime = sampleShowtimes.find(
      (s) => s.id === params.showtimeId
    );
    if (!foundShowtime) {
      console.error(`No showtime found for ID: ${params.showtimeId}`);
      notFound();
    }

    setShowtime(foundShowtime);
    const roomSeats = roomConfigurations[foundShowtime.room]();
    setSeats(roomSeats);
  }, [params.showtimeId]);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.status === "occupied") return;

    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seatId)
        ? prev.filter((s) => s.id !== seatId)
        : [...prev, seat]
    );
  };

  const handleClear = () => {
    setSelectedSeats([]);
  };

  const handleBook = (seatIds: string[]) => {
    console.log(`Booking showtime ${showtime?.id} for seats:`, seatIds);
    alert(`Booked seats: ${seatIds.join(", ")} for ${showtime?.movie}`);
  };

  if (!showtime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <SeatingChart
          seats={seats}
          onSeatClick={handleSeatClick}
          room={showtime?.room}
        />
      </div>
      <div className="space-y-4">
        <MovieDetails showtime={showtime} />
        <BookingSummary
          selectedSeats={selectedSeats}
          onClear={handleClear}
          onBook={handleBook}
        />
      </div>
    </div>
  );
}
