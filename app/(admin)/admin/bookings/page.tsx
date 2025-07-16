"use client";
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  useMovies,
  useDeleteMovie,
  usePlayMovie,
  useStopMovie,
} from "@/hooks/useMovie";
import { Eye, Pencil, Play, Search, StopCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSort } from "@/hooks/useSort";
import PaginationControls from "@/components/shared/PaginationControl";
import { useBookingById, useBookingHistory } from "@/hooks/useBooking";
import { BookingDetailModal } from './components/DetailBooking';

export default function BookingsHistory() {
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
        <p>Lỗi: {error?.message || "Đã xảy ra lỗi khi tải phim."}</p>
      </div>
    );
  }


  return (
    <div className="mx-2 space-y-6">
      {/* Filter and Create */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings Management</CardTitle>
          <CardDescription>Manage bookings for your application</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên"
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
              <TableHead>
                Tên người dùng
              </TableHead>
              <TableHead>
                Tên phim
              </TableHead>
              <TableHead>
                Tổng tiền
              </TableHead>
              <TableHead>
                Thời gian
              </TableHead>
              <TableHead>
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-secondary">
                <TableCell className="font-bold">{booking.user.fullName}</TableCell>
                <TableCell>
                  {booking.showTime.movie.name}
                </TableCell>
                <TableCell>{Number(booking.totalPrice).toLocaleString()} VNĐ</TableCell>
                <TableCell>{booking.createdAt}</TableCell>
                <TableCell className="px-0">
                  <Button variant="outline" className="mr-2" onClick={() => handleViewBooking(booking.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Chi tiết
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


