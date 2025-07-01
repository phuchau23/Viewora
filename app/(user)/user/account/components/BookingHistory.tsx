"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingHistory, useUserProfile } from "@/hooks/useUsers";

// Ticket interface
interface Ticket {
  id: string;
  movieName: string;
  bookingDate: string;
  theater: string;
  showTime: string;
  userName: string;
  userEmail: string;
  seatNumber: string;
  ticketPrice: number;
  screen?: string;
  dressCircle?: string;
  bookingId?: string;
  promotion?: {
    title: string;
    code: string;
    discountPrice: number;
  };

  snacks?: {
    name: string;
    quantity: number;
    unitPrice: number;
    image: string;
  }[];
}

// Ticket Card Component (unchanged)
const TicketCard: React.FC<{ ticket: Ticket; onClick: () => void }> = ({
  ticket,
  onClick,
}) => {
  const formattedDate = format(new Date(ticket.bookingDate), "MMM dd, yyyy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 p-3 rounded-lg shadow-md border-t-4 border-b-4 border-dashed border-orange-400 dark:border-orange-500/70 w-full max-w-2xl mx-auto overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-700 rounded-full shadow-inner" />
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-700 rounded-full shadow-inner" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="w-5 h-10 flex flex-col gap-[1px]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-1 bg-gray-800 dark:bg-gray-200"
              style={{ width: `${Math.random() * 6 + 3}px` }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3หน้าหลัก pr-10">
        <div className="space-y-1.5">
          <div>
            <h3 className="text-base font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wide">
              {ticket.movieName}
            </h3>
            <p className="text-xs  dark:text-gray-400, text-gray-600 dark:text-gray-400">
              Movie
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.userName}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Name</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {ticket.userEmail}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {formattedDate}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Date</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.showTime}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.theater}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Theater</p>
          </div>
        </div>
        <div className="space-y-1.5 text-right">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.seatNumber}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Seat</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.ticketPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Detailed Ticket View Component (updated for API data)
const TicketDetail: React.FC<{ ticket: Ticket; onClose: () => void }> = ({
  ticket,
  onClose,
}) => {
  const formattedDate = format(
    new Date(ticket.bookingDate),
    "EEE, dd MMM yyyy"
  );
  const formattedPrice = ticket.ticketPrice.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-orange-500 dark:text-orange-400">
            {ticket.movieName} (U)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ticket.theater}
          </p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Seat:</span> {ticket.seatNumber}
            </p>
          </div>
        </div>
        <div className="text-sm space-y-1 mb-4">
          <p>
            <span className="font-medium">Booked by:</span> {ticket.userName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {ticket.userEmail}
          </p>
          <p>
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Time:</span> {ticket.showTime}
          </p>
          <p>
            <span className="font-medium">Number of Tickets:</span>{" "}
            {ticket.seatNumber.split(", ").length}
          </p>
        </div>

        {/* Snacks section */}
        {ticket.snacks && ticket.snacks.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-semibold">Snacks:</h4>
            {ticket.snacks.map((snack, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="text-sm">
                  <p className="font-medium">{snack.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    x{snack.quantity} –{" "}
                    {snack.unitPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Promotion section */}
        {ticket.promotion && (
          <div className="mb-4 text-sm">
            <h4 className="font-semibold">Promotion:</h4>
            <p className="text-orange-500">
              {ticket.promotion.title} (Code: {ticket.promotion.code})
            </p>
            <p className="text-green-600">
              Discount: -
              {ticket.promotion.discountPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          A confirmation is sent on e-mail/SMS/WhatsApp within 15 minutes of
          booking.
        </p>

        <div className="text-right">
          <p className="text-sm">Total Amount</p>
          <p className="text-lg font-bold">{formattedPrice} ▼</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BookedTicketsPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Fetch user profile for userName and userEmail
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();

  // Fetch booking history
  const { data, isLoading, error } = useBookingHistory({
    pageIndex: 1,
    pageSize: 10,
  });

  // Map bookings to Ticket interface
  const tickets: Ticket[] =
    data?.bookings?.map((booking) => ({
      id: booking.bookingId,
      movieName: booking.showTime.movie.name || "Unknown Movie",
      movieId: booking.showTime.movie.id,
      bookingDate: booking.bookingDate,
      theater: booking.showTime.branch.name,
      showTime: format(new Date(booking.showTime.startTime), "HH:mm"),
      userName: profileData?.data?.fullName || "Unknown User",
      userEmail: profileData?.data?.email || "Unknown Email",
      seatNumber: booking.seats
        .map((seat) => `${seat.row}${seat.number}`)
        .join(", "),
      ticketPrice: booking.totalPrice,
      promotion: booking.promotion
        ? {
            title: booking.promotion.title,
            code: booking.promotion.code,
            discountPrice: booking.promotion.discountPrice,
          }
        : undefined,
      snacks: booking.snacks?.map((s) => ({
        name: s.snack.name,
        quantity: s.quantity,
        unitPrice: s.unitPrice,
        image: s.snack.image,
      })),
    })) || [];

  return (
    <main className="container mx-auto p-4 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          View your movie bookings
        </p>
      </div>

      {isLoading || profileLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm animate-pulse">
          Loading your tickets...
        </div>
      ) : error || profileError ? (
        <div className="text-center text-red-600 dark:text-red-400 text-sm bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          {error?.message ||
            profileError?.message ||
            "Failed to load tickets. Please try again."}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          No booked tickets found. Book your first movie ticket today!
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid gap-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetail
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default BookedTicketsPage;
