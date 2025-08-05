"use client";
import React from "react";
import { DollarSign, Users, Film, Play } from "lucide-react";
import MetricCard from "./MetricCard";
import { useTranslation } from "react-i18next";

const DashboardMetrics: React.FC<{
  statistics: {
    confirmedBookings: number;
    totalMovies: number;
    nowShowingMovies: number;
    totalRevenue: number;
  } | null;
  isLoading: boolean;
}> = ({ statistics, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title={t("dash.revenue")}
        value={statistics?.totalRevenue || 0}
        icon={<DollarSign className="h-6 w-6 text-white" />}
        color="bg-green-500"
        suffix="đ"
        isLoading={isLoading}
      />
      <MetricCard
        title={t("dash.bookings")}
        value={statistics?.confirmedBookings || 0}
        icon={<Users className="h-4 w-5 text-white" />}
        color="bg-blue-500"
        isLoading={isLoading}
      />
      <MetricCard
        title={t("dash.totalMovies")}
        value={statistics?.totalMovies || 0}
        icon={<Film className="h-4 w-5 text-white" />}
        color="bg-purple-500"
        isLoading={isLoading}
      />
      <MetricCard
        title={t("dash.nowShowing")}
        value={statistics?.nowShowingMovies || 0}
        icon={<Play className="h-4 w-5 text-white" />}
        color="bg-green-500"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardMetrics;
