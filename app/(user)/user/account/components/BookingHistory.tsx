// components/BookedTicketsPage.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useTickets } from "@/hooks/useTickets";
import { Ticket } from "@/lib/api/service/fetchTicket";

// Component TicketCard
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
      {/* Decorative ticket stub effect */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-700 rounded-full shadow-inner" />
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-700 rounded-full shadow-inner" />
      {/* Faux barcode effect */}
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

      {/* Ticket Content */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-10">
        {/* Left Column: Movie and User Details */}
        <div className="space-y-1.5">
          <div>
            <h3 className="text-base font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wide">
              {ticket.movieName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Movie</p>
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

        {/* Middle Column: Date, Time, Theater */}
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

        {/* Right Column: Seat and Price */}
        <div className="space-y-1.5 text-right">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {ticket.seatNumber}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Seat</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              ${ticket.ticketPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Component TicketDetail
const TicketDetail: React.FC<{ ticket: Ticket; onClose: () => void }> = ({
  ticket,
  onClose,
}) => {
  const formattedDate = format(
    new Date(ticket.bookingDate),
    "EEE, dd MMM yyyy hh:mm a"
  );
  const formattedPrice = `Rs.${(ticket.ticketPrice * 82.5).toFixed(2)}`; // Convert USD to INR (approx. exchange rate)

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
        {/* Ticket Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-orange-500 dark:text-orange-400">
            {ticket.movieName} (U)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ticket.theater}
          </p>
        </div>

        {/* QR Code and Core Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
            {/* QR Code Placeholder */}
            <div className="w-20 h-20 bg-gray-500" />
          </div>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Ticket ID:</span> {ticket.id}
            </p>
            <p>
              <span className="font-medium">Booking ID:</span>{" "}
              {ticket.bookingId || "N/A"}
            </p>
            <p>
              <span className="font-medium">Screen:</span>{" "}
              {ticket.screen || "N/A"}
            </p>
            <p>
              <span className="font-medium">Dress Circle:</span>{" "}
              {ticket.dressCircle || "N/A"}
            </p>
            <p>
              <span className="font-medium">Seat:</span> {ticket.seatNumber}
            </p>
          </div>
        </div>

        {/* User and Booking Details */}
        <div className="text-sm space-y-1 mb-4">
          <p>
            <span className="font-medium">Booked by:</span> {ticket.userName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {ticket.userEmail}
          </p>
          <p>
            <span className="font-medium">Date & Time:</span> {formattedDate} at{" "}
            {ticket.showTime}
          </p>
          <p>
            <span className="font-medium">Number of Tickets:</span> 1
          </p>
        </div>

        {/* Confirmation Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          A confirmation is sent on e-mail/SMS/WhatsApp within 15 minutes of
          booking.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-red-500 flex items-center space-x-2"
            onClick={onClose}
          >
            <span className="text-xl">X</span>
            <span>Close</span>
          </button>
          <button
            className="text-blue-500 flex items-center space-x-2"
            onClick={onClose}
          >
            <span className="text-xl">📞</span>
            <span>Contact support</span>
          </button>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <p className="text-sm">Total Amount</p>
          <p className="text-lg font-bold">{formattedPrice} ▼</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Component chính BookedTicketsPage
const BookedTicketsPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { isError, isLoading, error, data } = useTickets({
    pageIndex: 1,
    pageSize: 10,
  });

  // Lấy dữ liệu từ data, đảm bảo giá trị mặc định
  const tickets = data?.tickets || [];
  const totalItems = data?.totalItems || 0;
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 1;

  return (
    <main className="container mx-auto p-4 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          View your movie bookings
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-red-600 dark:text-red-400 text-sm bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          Loading your tickets...
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 dark:text-red-400 text-sm bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          {error?.message || "Failed to load tickets. Please try again."}
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

      {totalItems > 0 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages} ({totalItems} tickets)
          </p>
        </div>
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
