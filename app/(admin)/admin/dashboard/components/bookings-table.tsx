"use client";
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
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVND } from "@/utils/price/formatPrice";
import { exportToCSV } from "@/utils/export/exportToCSV";
import { useSort } from "@/hooks/useSort";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/ui/pagination";
import { CustomPagination } from "./custom-pagination";

export function BookingsTable({
  data,
  pagination,
  setPagination,
  pageCount,
  isLoading = false,
}: {
  data: any[];
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  pageCount: number;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const { sortConfig, handleSort, sortedData } = useSort([
    "createdAt",
    "userName",
    "movieName",
    "totalPrice",
  ]);

  const searchedBookings = useMemo(() => {
    if (!searchTerm) return data ?? [];
    return (data ?? []).filter(
      (b: any) =>
        b.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.showTime?.movie?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedBookings = useMemo(() => {
    if (sortConfig.key) {
      return sortedData(searchedBookings);
    }

    // Mặc định sort theo createdAt DESC (mới nhất trước)
    return [...searchedBookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [searchedBookings, sortedData, sortConfig]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 mb-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleExport = () => {
    if (!sortedBookings.length) return;
    exportToCSV(
      "bookings.csv",
      [t("user"), t("nav.movies"), t("book.date"), t("total")],
      sortedBookings,
      (b: any) => [
        b.user?.fullName,
        b.showTime?.movie?.name,
        new Date(b.createdAt).toLocaleString(),
        formatVND(parseFloat(b.totalPrice || "0")),
        b.status,
      ]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search + Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("header.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.slice(0, 28))}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("userName")}>
              {t("user")}{" "}
              {sortConfig.key === "userName" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("movieName")}>
              {t("nav.movies")}{" "}
              {sortConfig.key === "movieName" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("createdAt")}>
              {t("book.date")}{" "}
              {sortConfig.key === "createdAt" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("totalPrice")}>
              {t("total")}{" "}
              {sortConfig.key === "totalPrice" &&
                (sortConfig.direction === "ascending" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBookings.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell>{b.user?.fullName}</TableCell>
              <TableCell>{b.showTime?.movie?.name}</TableCell>
              <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {formatVND(parseFloat(b.totalPrice || "0"))}
              </TableCell>
              <TableCell>{b.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <CustomPagination
          pageIndex={pagination.pageIndex}
          pageCount={pageCount}
          onPageChange={(page) =>
            setPagination({ ...pagination, pageIndex: page })
          }
        />
      </div>
    </div>
  );
}
