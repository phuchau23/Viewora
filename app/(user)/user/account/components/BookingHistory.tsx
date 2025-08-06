"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingHistory, useUserProfile } from "@/hooks/useUsers";
import { useBookingById } from "@/hooks/useBooking";
import { useTranslation } from "react-i18next";

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
  seatType?: string;
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

// Ticket Card
const TicketCard: React.FC<{ ticket: Ticket; onClick: () => void }> = ({
  ticket,
  onClick,
}) => {
  const { t } = useTranslation();
  const formattedDate = format(new Date(ticket.bookingDate), "MMM dd, yyyy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 rounded-lg shadow-md border-t-4 border-b-4 border-dashed border-orange-400 dark:border-orange-500/70 w-full max-w-2xl mx-auto cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-3 pr-10">
        <h3 className="text-base font-bold text-orange-500 uppercase tracking-wide">
          {ticket.movieName}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-600 break-words whitespace-normal">
              {t("book.name")}
            </p>
            <p className="text-sm font-medium break-words whitespace-normal">
              {ticket.userName}
            </p>
            <p className="text-xs text-gray-600 break-words whitespace-normal">
              {t("book.email")}
            </p>
            <p className="text-sm font-medium break-words whitespace-normal">
              {ticket.userEmail}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">{t("book.seat")}</p>
            <p className="text-sm font-medium">{ticket.seatNumber}</p>
            <p className="text-xs text-gray-600">{t("book.seatType")}</p>
            <p className="text-sm font-medium">{ticket.seatType}</p>
            <p className="text-xs text-gray-600">{t("book.price")}</p>
            <p className="text-sm font-medium">
              {ticket.ticketPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Ticket Detail
const TicketDetail: React.FC<{ ticket: Ticket; onClose: () => void }> = ({
  ticket,
  onClose,
}) => {
  const { t } = useTranslation();
  const { booking } = useBookingById(ticket.id);
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
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-orange-500">
            {ticket.movieName}
          </h3>
          <p className="text-sm text-black dark:text-black">{ticket.theater}</p>
        </div>

        {booking?.qrCodeUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/png;base64,${booking.qrCodeUrl}`}
              alt={t("book.qr")}
              className="w-40 h-40 rounded border shadow"
            />
          </div>
        )}

        <div className="text-sm text-black dark:text-black mb-4">
          <p>
            <b>{t("book.seat")}:</b> {ticket.seatNumber}
          </p>
          <p>
            <b>{t("book.seatType")}:</b> {ticket.seatType}
          </p>
          <p>
            <b>{t("book.bookedBy")}:</b> {ticket.userName}
          </p>
          <p>
            <b>{t("book.email")}:</b> {ticket.userEmail}
          </p>
          <p>
            <b>{t("book.date")}:</b> {formattedDate}
          </p>
          <p>
            <b>{t("book.time")}:</b> {ticket.showTime}
          </p>
        </div>

        {/* Snacks section */}
        {ticket.snacks && ticket.snacks.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-semibold text-black dark:text-black">
              Snacks:
            </h4>
            {ticket.snacks.map((snack, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="text-sm text-black dark:text-black">
                  <p className="font-medium">{snack.name}</p>
                  <p className="text-xs">
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

        {ticket.promotion && (
          <div className="mb-4 text-sm text-black dark:text-black">
            <h4 className="font-semibold">{t("book.promotion")}:</h4>
            <p className="text-orange-500">
              {ticket.promotion.title} ({t("book.code")}:{" "}
              {ticket.promotion.code})
            </p>
            <p className="text-green-600">
              {t("book.discount")}: -
              {ticket.promotion.discountPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        )}

        <p className="text-xs text-black dark:text-black mb-4">
          {t("book.confirmation")}
        </p>

        <div className="text-right text-black dark:text-black">
          <p className="text-sm">{t("book.totalAmount")}</p>
          <p className="text-lg font-bold">{formattedPrice} ▼</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BookedTicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { data, isLoading, error } = useBookingHistory({
    pageIndex: 1,
    pageSize: 10,
  });
  const { data: profileData } = useUserProfile();

  const tickets: Ticket[] =
    data?.bookings
      ?.map((booking) => ({
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
        seatType: booking.seats?.[0]?.seatType?.name || "Standard Seat",
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
      }))
      .sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      ) || [];

  return (
    <main className="container mx-auto p-4 max-w-4xl bg-gray-50 dark:bg-gray-900">
      <p className="text-xs text-gray-900 dark:text-white">
        {t("book.viewYourBookings")}
      </p>

      {isLoading ? (
        <p className="text-center">{t("book.loading")}</p>
      ) : error ? (
        <p className="text-center text-red-600">{t("book.error")}</p>
      ) : tickets.length === 0 ? (
        <p className="text-center">{t("book.noTickets")}</p>
      ) : (
        <AnimatePresence>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => setSelectedTicket(ticket)}
            />
          ))}
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
