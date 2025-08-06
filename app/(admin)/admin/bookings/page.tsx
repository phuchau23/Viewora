"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingHistory } from "@/hooks/useBooking";
import { Eye, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingDetailModal } from "./components/DetailBooking";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function BookingsHistory() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const { bookings, isLoading, isError, error } = useBookingHistory();

  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.showTime.movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredBookings]);

  const paginatedBookings = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return sortedBookings.slice(start, start + pageSize);
  }, [sortedBookings, pageIndex]);

  const totalPages = Math.ceil(sortedBookings.length / pageSize);

  const handleViewBooking = (bookingId: string) => {
    setBookingId(bookingId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setBookingId("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-32 mb-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <p>
          {t("adminbooking.error")}:{" "}
          {error?.message || t("adminbooking.errorFallback")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("adminbooking.title")}</CardTitle>
          <CardDescription>{t("adminbooking.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>{t("adminbooking.userName")}</TableHead>
              <TableHead>{t("adminbooking.movieName")}</TableHead>
              <TableHead>{t("adminbooking.totalPrice")}</TableHead>
              <TableHead>{t("adminbooking.createdAt")}</TableHead>
              <TableHead>{t("adminbooking.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-secondary">
                <TableCell className="font-bold">
                  {booking.user.fullName}
                </TableCell>
                <TableCell>{booking.showTime.movie.name}</TableCell>
                <TableCell>
                  {Number(booking.totalPrice).toLocaleString()} VNĐ
                </TableCell>
                <TableCell>{booking.createdAt}</TableCell>
                <TableCell className="px-0">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleViewBooking(booking.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t("adminbooking.detailButton")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Trang {pageIndex} / {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
          >
            {t("pagination.prev")}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setPageIndex((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={pageIndex === totalPages}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>

      <BookingDetailModal
        bookingId={bookingId}
        open={openModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
