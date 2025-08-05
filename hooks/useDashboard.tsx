import DashboardService, {
  DashboardStatisticsResponse,
  RevenueDataItem,
  RevenueParams,
  RevenueResponse,
  TopSellingMovie,
  TopSellingMoviesResponse,
} from "@/lib/api/service/fetchDashboard";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

// Hook: Lấy thống kê dashboard
export function useDashboardStatistics(branchId?: string) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<
    DashboardStatisticsResponse,
    Error,
    DashboardStatisticsResponse["data"]
  >({
    queryKey: ["dashboard", "statistics", branchId],
    queryFn: () => DashboardService.getStatistics(branchId),
    enabled: isAuthenticated,
    select: (data) => data.data,
  });
}

// Hook: Lấy top movie bán chạy
export function useTopSellingMovies(params?: {
  top?: number;
  branchId?: string;
}) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<TopSellingMoviesResponse, Error, TopSellingMovie[]>({
    queryKey: ["dashboard", "topSellingMovies", params],
    queryFn: () => DashboardService.getTopSellingMovies(params),
    enabled: isAuthenticated,
    select: (data) => data.data,
  });
}

// Hook: Lấy doanh thu theo kỳ
export function useRevenue(params?: RevenueParams) {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<
    RevenueResponse,
    Error,
    { period: string; revenueData: RevenueDataItem[]; totalRevenue: number }
  >({
    queryKey: ["dashboard", "revenue", params],
    queryFn: () => DashboardService.getRevenue(params),
    enabled: isAuthenticated,
    select: (data) => data.data,
  });
}
export function useRevenueYears() {
  const token = getCookie("auth-token");
  const isAuthenticated = !!token;

  return useQuery<string[]>({
    queryKey: ["dashboard", "revenueYears"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const years = [
        currentYear,
        currentYear - 1,
        currentYear - 2,
        currentYear - 3,
      ];
      const result: string[] = [];

      for (const y of years) {
        const res = await DashboardService.getRevenue({
          Period: "Year",
          Year: y,
        });
        if (res?.data?.totalRevenue && res.data.totalRevenue > 0) {
          result.push(y.toString());
        }
      }

      return result;
    },
  });
}
