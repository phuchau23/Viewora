"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
  DollarSign,
  Clock,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  Play,
  Pause,
  Activity,
} from "lucide-react";
import { useMovies } from "@/hooks/useMovie";
import { useBookingHistory } from "@/hooks/useBooking";

const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}> = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;
    const endCount = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(startCount + (endCount - startCount) * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}> = ({
  title,
  value,
  change,
  icon,
  color,
  prefix = "",
  suffix = "",
  isLoading = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
    <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">
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
  children: React.ReactNode;
  icon: React.ReactNode;
  isLoading?: boolean;
}> = ({ title, children, icon, isLoading = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {isLoading ? (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-64 rounded"></div>
      </div>
    ) : (
      children
    )}
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly" | "yearly">(
    "monthly"
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch real data from APIs
  const {
    movies,
    isLoading: moviesLoading,
    totalPages: movieTotalPages,
  } = useMovies(1, 100);
  const {
    bookings,
    isLoading: bookingsLoading,
    totalPages: bookingTotalPages,
  } = useBookingHistory(currentPage, 100);

  // Process booking data for analytics
  const processedData = useMemo(() => {
    if (!bookings.length) return null;

    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + parseFloat(booking.totalPrice || "0");
    }, 0);

    // Group bookings by movie
    const movieBookings = bookings.reduce((acc, booking) => {
      const movieName = booking.showTime.movie.name;
      const movieId = booking.showTime.movie.id;

      if (!acc[movieId]) {
        acc[movieId] = {
          movie: movieName,
          bookings: 0,
          revenue: 0,
        };
      }

      acc[movieId].bookings += 1;
      acc[movieId].revenue += parseFloat(booking.totalPrice || "0");

      return acc;
    }, {} as Record<string, { movie: string; bookings: number; revenue: number }>);

    // Convert to array and sort by bookings
    const topMovies = Object.values(movieBookings)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    // Group bookings by date for revenue trend
    const revenueByDate = bookings.reduce((acc, booking) => {
      const date = new Date(booking.createdAt).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = {
          name: date,
          revenue: 0,
          bookings: 0,
        };
      }

      acc[date].revenue += parseFloat(booking.totalPrice || "0");
      acc[date].bookings += 1;

      return acc;
    }, {} as Record<string, { name: string; revenue: number; bookings: number }>);

    const revenueData = Object.values(revenueByDate)
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
      .slice(-30); // Last 30 days

    // Calculate movie type distribution
    const movieTypes = movies.reduce((acc, movie) => {
      movie.movieTypes.forEach((type) => {
        if (!acc[type.name]) {
          acc[type.name] = 0;
        }
        acc[type.name] += 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
    ];
    const genreDistribution = Object.entries(movieTypes).map(
      ([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      })
    );

    return {
      totalRevenue,
      totalBookings: bookings.length,
      topMovies,
      revenueData,
      genreDistribution,
    };
  }, [bookings, movies]);

  // Calculate movie statistics
  const movieStats = useMemo(() => {
    if (!movies.length)
      return { total: 0, nowShowing: 0, upcoming: 0, ended: 0 };

    const stats = movies.reduce(
      (acc, movie) => {
        acc.total += 1;
        switch (movie.status.toLowerCase()) {
          case "nowshowing":
            acc.nowShowing += 1;
            break;
          case "upcoming":
            acc.upcoming += 1;
            break;
          case "ended":
            acc.ended += 1;
            break;
        }
        return acc;
      },
      { total: 0, nowShowing: 0, upcoming: 0, ended: 0 }
    );

    return stats;
  }, [movies]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!movies.length) return 0;
    const totalRating = movies.reduce((sum, movie) => sum + movie.rate, 0);
    return totalRating / movies.length;
  }, [movies]);

  // Recent activity from bookings
  const recentActivity = useMemo(() => {
    return bookings
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((booking) => ({
        time: new Date(booking.createdAt).toLocaleString(),
        action: `New booking for ${booking.showTime.movie.name}`,
        user: booking.user.fullName,
        amount: `$${parseFloat(booking.totalPrice || "0").toFixed(2)}`,
      }));
  }, [bookings]);

  const isLoading = moviesLoading || bookingsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Movie Booking Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time analytics and insights for your cinema
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Doanh Thu (VND)"
            value={processedData?.totalRevenue || 0}
            change={12.5}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-green-500"
            isLoading={isLoading}
          />
          <MetricCard
            title="Số Lượng Đặt Vé"
            value={processedData?.totalBookings || 0}
            change={8.2}
            icon={<Users className="h-4 w-5 text-white" />}
            color="bg-blue-500"
            suffix=""
            isLoading={isLoading}
          />
          <MetricCard
            title="Số Phim"
            value={movieStats.total}
            change={5.1}
            icon={<Film className="h-4  w-5 text-white" />}
            color="bg-purple-500"
            isLoading={isLoading}
          />
          <MetricCard
            title="Đánh Giá Trung Bình"
            value={averageRating}
            change={2.3}
            icon={<Star className="h-4 w-5 text-white" />}
            color="bg-yellow-500"
            suffix="/5"
            isLoading={isLoading}
          />
          <MetricCard
            title="Phim Đang Chiếu"
            value={movieStats.nowShowing}
            change={3.2}
            icon={<Play className="h-4 w-5 text-white" />}
            color="bg-green-500"
            isLoading={isLoading}
          />
        </div>

        {/* Movie Status Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div> */}

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex space-x-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200 w-fit">
            {(["daily", "monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  timePeriod === period
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <ChartCard
            title="Doanh Thu (VND)"
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedData?.revenueData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Movies by Bookings */}
          <ChartCard
            title="Phim Đang Chiếu"
            icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={processedData?.topMovies || []}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis
                  dataKey="movie"
                  type="category"
                  stroke="#666"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="bookings" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
          {/* Genre Distribution */}
          <ChartCard
            title="Phân Loại Phim"
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {(processedData?.genreDistribution || []).map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                    <span className="text-sm text-gray-600">{genre.name}</span>
                  </div>
                  <span className="text-sm font-medium">{genre.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border h-auto border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Hoạt Động Gần Đây
              </h3>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-start space-x-3 p-3"
                  >
                    <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user} • {activity.amount} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent bookings found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
