"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useBookingHistory } from "@/hooks/useBooking";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationControls from "@/components/shared/PaginationControl";
import { BookingDetailModal } from "./components/DetailBooking";
import { useTranslation } from "react-i18next";

export default function BookingsHistory() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const { bookings, isLoading, isError, error, totalPages } = useBookingHistory(
    pageIndex,
    pageSize
  );

  const handleViewBooking = (bookingId: string) => {
    setBookingId(bookingId);
    setOpenModal(true);
    console.log(bookingId);
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
      {/* Filter and Create */}
      <Card>
        <CardHeader>
          <CardTitle>{t("adminbooking.title")}</CardTitle>
          <CardDescription>{t("adminbooking.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Table */}
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
            {bookings?.map((booking) => (
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

      {/* Pagination */}
      <PaginationControls
        currentPage={pageIndex}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(page) => setPageIndex(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(1);
        }}
      />

      {/* Modal */}
      <BookingDetailModal
        bookingId={bookingId}
        open={openModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
