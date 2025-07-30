"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Film,
  DollarSign,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  Play,
  Activity,
} from "lucide-react";
import { useMovies } from "@/hooks/useMovie";
import { useBookingHistory } from "@/hooks/useBooking";
import { useTranslation } from "react-i18next";

// Animated counter
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
}> = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const startCount = 0;
    const endCount = value;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 2000, 1);
      setCount(Math.floor(startCount + (endCount - startCount) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Metric card
const MetricCard: React.FC<{
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}> = ({ title, value, change, icon, color, prefix, suffix, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div className="flex items-center space-x-1">
        {change > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`text-sm font-medium ${
            change > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {Math.abs(change)}%
        </span>
      </div>
    </div>
    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
      {title}
    </h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {isLoading ? (
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      ) : (
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      )}
    </p>
  </motion.div>
);

const ChartCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, isLoading, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
    </div>
    {isLoading ? (
      <div className="animate-pulse bg-gray-200 h-64 rounded" />
    ) : (
      children
    )}
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly" | "yearly">(
    "monthly"
  );

  const { movies, isLoading: moviesLoading } = useMovies(1, 100);
  const { bookings, isLoading: bookingsLoading } = useBookingHistory(1, 100);

  const processedData = useMemo(() => {
    if (!bookings.length) return null;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + parseFloat(b.totalPrice || "0"),
      0
    );
    const movieBookings = bookings.reduce((acc, b) => {
      const movieName = b.showTime.movie.name;
      const movieId = b.showTime.movie.id;
      if (!acc[movieId])
        acc[movieId] = { movie: movieName, bookings: 0, revenue: 0 };
      acc[movieId].bookings += 1;
      acc[movieId].revenue += parseFloat(b.totalPrice || "0");
      return acc;
    }, {} as Record<string, { movie: string; bookings: number; revenue: number }>);
    const topMovies = Object.values(movieBookings)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
    const revenueData = bookings.reduce((acc, b) => {
      const date = new Date(b.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { name: date, revenue: 0 };
      acc[date].revenue += parseFloat(b.totalPrice || "0");
      return acc;
    }, {} as Record<string, { name: string; revenue: number }>);

    const movieTypes = movies.reduce((acc, m) => {
      m.movieTypes.forEach(
        (type) => (acc[type.name] = (acc[type.name] || 0) + 1)
      );
      return acc;
    }, {} as Record<string, number>);
    const genreDistribution = Object.entries(movieTypes).map(
      ([name, value], i) => ({
        name,
        value,
        color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5],
      })
    );
    return {
      totalRevenue,
      totalBookings: bookings.length,
      topMovies,
      revenueData: Object.values(revenueData),
      genreDistribution,
    };
  }, [bookings, movies]);

  const movieStats = useMemo(() => {
    if (!movies.length) return { total: 0, nowShowing: 0 };
    return movies.reduce(
      (acc, m) => {
        acc.total++;
        if (m.status.toLowerCase() === "nowshowing") acc.nowShowing++;
        return acc;
      },
      { total: 0, nowShowing: 0 }
    );
  }, [movies]);

  const averageRating = useMemo(
    () =>
      movies.length
        ? movies.reduce((s, m) => s + m.rate, 0) / movies.length
        : 0,
    [movies]
  );
  const recentActivity = useMemo(
    () =>
      bookings.slice(0, 5).map((b) => ({
        time: new Date(b.createdAt).toLocaleString(),
        action: `${t("recentActivity.booking")} ${b.showTime.movie.name}`,
        user: b.user.fullName,
        amount: `${parseFloat(b.totalPrice || "0").toLocaleString()} VND`,
      })),
    [bookings, t]
  );

  const isLoading = moviesLoading || bookingsLoading;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl w-full bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">{t("dashboardtitle")}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("dashboardsubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title={t("metrics.revenue")}
            value={processedData?.totalRevenue || 0}
            change={12.5}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-green-500"
            suffix="đ"
            isLoading={isLoading}
          />
          <MetricCard
            title={t("metrics.bookings")}
            value={processedData?.totalBookings || 0}
            change={8.2}
            icon={<Users className="h-4 w-5 text-white" />}
            color="bg-blue-500"
            isLoading={isLoading}
          />
          <MetricCard
            title={t("metrics.movies")}
            value={movieStats.total}
            change={5.1}
            icon={<Film className="h-4 w-5 text-white" />}
            color="bg-purple-500"
            isLoading={isLoading}
          />
          <MetricCard
            title={t("metrics.rating")}
            value={averageRating}
            change={2.3}
            icon={<Star className="h-4 w-5 text-white" />}
            color="bg-yellow-500"
            suffix="/5"
            isLoading={isLoading}
          />
          <MetricCard
            title={t("metrics.nowShowing")}
            value={movieStats.nowShowing}
            change={3.2}
            icon={<Play className="h-4 w-5 text-white" />}
            color="bg-green-500"
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title={t("charts.revenueTrend")}
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedData?.revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={t("charts.topMovies")}
            icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData?.topMovies || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis
                  dataKey="movie"
                  type="category"
                  stroke="#666"
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title={t("charts.genreDistribution")}
            icon={<PieChartIcon className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={processedData?.genreDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(processedData?.genreDistribution || []).map(
                    (entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("recentActivity.title")}
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivity.length ? (
                recentActivity.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">{a.action}</p>
                      <p className="text-xs text-gray-500">{`${a.user} • ${a.amount} • ${a.time}`}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">
                  {t("recentActivity.empty")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
