import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface DashboardMetric {
  value: number;
  change: number;
}

export interface ShopOverviewStats {
  totalRevenue: DashboardMetric;
  thisMonthRevenue: DashboardMetric;
  totalOrders: DashboardMetric;
  totalCustomers: DashboardMetric;
  activeProducts: DashboardMetric;
  lowStockProducts: DashboardMetric;
  pendingOrders: DashboardMetric;
  conversionRate: DashboardMetric;
  averageOrderValue: DashboardMetric;
  totalInterests: DashboardMetric;
  totalTransactions: DashboardMetric;
  totalProducts: DashboardMetric;
}

export interface ShopRevenueTrend {
  labels: string[];
  values: number[];
}

export interface ShopOrderTrend {
  labels: string[];
  values: number[];
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}

export interface TopProduct {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
  orders: number;
  lastSoldAt: string;
}

export interface RecentShopActivity {
  text: string;
  time: string;
  type: "success" | "info" | "warning";
}

export const shopDashboardApi = createApi({
  reducerPath: "shopDashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ShopDashboard"],

  endpoints: (builder) => ({
    getShopOverviewStats: builder.query<{ success: boolean; data: ShopOverviewStats }, void>({
      query: () => ({
        url: "/shop-dashboard/overview",
        method: "GET",
      }),
      providesTags: ["ShopDashboard"],
    }),

    getShopRevenueTrend: builder.query<
      { success: boolean; data: ShopRevenueTrend },
      { period?: "3months" | "6months" | "1year" }
    >({
      query: (params) => ({
        url: "/shop-dashboard/revenue-trend",
        method: "GET",
        params: {
          period: params.period || "6months",
        },
      }),
      providesTags: ["ShopDashboard"],
    }),

    getShopOrderTrend: builder.query<
      { success: boolean; data: ShopOrderTrend },
      { period?: "week" | "month" | "quarter" }
    >({
      query: (params) => ({
        url: "/shop-dashboard/order-trend",
        method: "GET",
        params: {
          period: params.period || "month",
        },
      }),
      providesTags: ["ShopDashboard"],
    }),

    getShopTopProducts: builder.query<
      { success: boolean; data: TopProduct[] },
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/shop-dashboard/top-products",
        method: "GET",
        params: {
          limit: params?.limit || 6,
        },
      }),
      providesTags: ["ShopDashboard"],
    }),

    getShopRecentActivities: builder.query<
      { success: boolean; data: RecentShopActivity[] },
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/shop-dashboard/recent-activities",
        method: "GET",
        params: {
          limit: params?.limit || 8,
        },
      }),
      providesTags: ["ShopDashboard"],
    }),
  }),
});

export const {
  useGetShopOverviewStatsQuery,
  useGetShopRevenueTrendQuery,
  useGetShopOrderTrendQuery,
  useGetShopTopProductsQuery,
  useGetShopRecentActivitiesQuery,
} = shopDashboardApi;
