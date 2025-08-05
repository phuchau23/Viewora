"use client";
import React, { useState } from "react";
import {
  useDashboardStatistics,
  useRevenue,
  useTopSellingMovies,
} from "@/hooks/useDashboard";
import { useBookingHistory } from "@/hooks/useBooking";
import DashboardLayout from "./DashboardLayout";
import DashboardMetrics from "./DashboardMetrics";
import DashboardRevenueCharts from "./DashboardRevenueCharts";
import DashboardTopMovies from "./DashboardTopMovies";
import DashboardRecentMovies from "./DashboardRecentMovies";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookingsTable } from "./bookings-table";
import { useTranslation } from "react-i18next";

const branchMap: Record<string, string | undefined> = {
  main: undefined,
  "THỦ ĐỨC": "684fb8feae62fa97def733ed",
  "GÒ VẤP": "684fbeb9f1439be9da6f80f4",
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const [activeBranch, setActiveBranch] = useState("main");
  const branchId = branchMap[activeBranch];

  const { data: statistics, isLoading: isStatsLoading } =
    useDashboardStatistics(branchId);
  const totalRevenue = statistics?.totalRevenue ?? 0;

  const { data: monthlyRevenueData, isLoading: isMonthlyRevenueLoading } =
    useRevenue({
      Period: "month",
      Year: 2025,
      Month: 8,
      BranchId: branchId,
    });

  const { data: yearlyRevenueData, isLoading: isYearlyRevenueLoading } =
    useRevenue({
      Period: "year",
      Year: 2025,
      BranchId: branchId,
    });

  const { data: topMovies, isLoading: isTopLoading } = useTopSellingMovies({
    top: 5,
    branchId,
  });

  const {
    bookings,
    totalPages,
    isLoading: isBookingsLoading,
  } = useBookingHistory(1, 5);

  const monthlyRevenueTotal = monthlyRevenueData?.totalRevenue ?? 0;

  return (
    <DashboardLayout
      activeBranch={activeBranch}
      onBranchChange={setActiveBranch}
    >
      <DashboardMetrics
        statistics={
          statistics
            ? {
                confirmedBookings: statistics.confirmedBookings,
                totalMovies: statistics.totalMovies,
                nowShowingMovies: statistics.nowShowingMovies,
                totalRevenue: statistics.totalRevenue, // <-- truyền vào đây
              }
            : null
        }
        isLoading={isStatsLoading}
      />

      <DashboardRevenueCharts branchId={branchId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardTopMovies
          topMovies={topMovies ?? []}
          isLoading={isTopLoading}
        />
        <DashboardRecentMovies />
      </div>

      {/* --- Bảng lịch sử giao dịch --- */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dash.bookingHistoryTitle")}</CardTitle>
          <CardDescription>{t("dash.bookingHistoryDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsTable
            data={bookings}
            pagination={{ pageIndex: 0, pageSize: 5 }}
            setPagination={() => {}}
            pageCount={totalPages}
            isLoading={isBookingsLoading}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPage;
