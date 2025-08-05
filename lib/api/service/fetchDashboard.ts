import apiService from "../core";

export interface DashboardStatisticsData {
  totalMovies: number;
  totalCustomers: number;
  nowShowingMovies: number;
  confirmedBookings: number;
  totalRevenue: number; 
}

export interface DashboardStatisticsResponse {
  code: number;
  statusCode: string;
  message: string;
  data: DashboardStatisticsData;
}

export interface TopSellingMovie {
  movieId: string;
  movieName: string; 
  totalBookings: number;
  totalRevenue: number;
  poster: string;
  banner: string;
}

export interface TopSellingMoviesResponse {
  code: number;
  statusCode: string;
  message: string;
  data: TopSellingMovie[];
}

export interface RevenueDataItem {
  label: string;       // label theo period (ngày/tháng/năm)
  revenue: number;
  bookingCount: number;
}

export interface RevenueDataResponse {
  period: string; // day, month, year
  revenueData: RevenueDataItem[];
  totalRevenue: number;
}

export interface RevenueResponse {
  code: number;
  statusCode: string;
  message: string;
  data: RevenueDataResponse;
}

export interface RevenueParams {
  Period?: string;
  Year?: number;
  Month?: number;
  Day?: number;
  BranchId?: string;
  [key: string]: string | number | undefined; 
}


export const DashboardService = {
  getStatistics: async (branchId?: string): Promise<DashboardStatisticsResponse> => {
    const response = await apiService.get<DashboardStatisticsResponse>(
      "/dashboard/statistics",
      branchId ? { branchId } : {}
    );
    return response.data;
  },

  getTopSellingMovies: async (params?: { top?: number; branchId?: string }): Promise<TopSellingMoviesResponse> => {
    const response = await apiService.get<TopSellingMoviesResponse>(
      "/dashboard/top-selling-movies",
      {
        top: params?.top ?? 5,
        branchId: params?.branchId,
      }
    );
    return response.data;
  },

  getRevenue: async (params?: RevenueParams): Promise<RevenueResponse> => {
    const response = await apiService.get<RevenueResponse>(
      "/dashboard/revenue",
      params
    );
    return response.data;
  },
};

export default DashboardService;
