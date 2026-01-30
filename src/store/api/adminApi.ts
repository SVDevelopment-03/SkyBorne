
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface OverviewStats {
  activeUsers: { value: number; change: number };
  monthlyRevenue: { value: number; change: number };
  totalRevenue: { value: number; change: number };
  activeTrainers: { value: number; change: number };
  growthRate: { value: number | string; change: number };
  pendingApprovals: { value: number; change: number };
  sessionsThisMonth: { value: number; change: number };
}

export interface GrowthData {
  labels: string[];
  values: number[];
}

export interface RecentActivity {
  text: string;
  time: string;
  type: "success" | "info" | "warning";
}

export interface TopService {
  service: string;
  users: number;
  revenue: string;
}

export interface Payment {
  _id: string;
  userId: { firstName: string; lastName: string; email: string };
  amount: number;
  status: string;
  createdAt: string;
}

export interface CountryRevenueRow {
  country: string;
  count: number;
  amount: number;
}

export interface CountryRevenueData {
  rows: CountryRevenueRow[];
  grandTotal: CountryRevenueRow;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminStats"],

  endpoints: (builder) => ({
    // Get overview stats
    getOverviewStats: builder.query<{ success: boolean; data: OverviewStats }, void>({
      query: () => ({
        url: "/stats/overview",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // Get user growth
    getUserGrowth: builder.query<
      { success: boolean; data: GrowthData },
      { period?: "week" | "month" | "quarter" }
    >({
      query: (params) => ({
        url: "/stats/user-growth",
        method: "GET",
        params: {
          period: params.period || "week",
        },
      }),
      providesTags: ["AdminStats"],
    }),

    // Get monthly revenue
    getMonthlyRevenue: builder.query<
      { success: boolean; data: GrowthData },
      { period?: "3months" | "6months" | "1year" }
    >({
      query: (params) => ({
        url: "/stats/monthly-revenue",
        method: "GET",
        params: {
          period: params.period || "6months",
        },
      }),
      providesTags: ["AdminStats"],
    }),

    // Get recent activities
    getRecentActivities: builder.query<
      { success: boolean; data: RecentActivity[] },
      void
    >({
      query: () => ({
        url: "/stats/recent-activities",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // Get top services
    getTopServices: builder.query<
      { success: boolean; data: TopService[] },
      void
    >({
      query: () => ({
        url: "/stats/top-services",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // Get pending approvals
    getPendingApprovals: builder.query<
      { success: boolean; data: Payment[] },
      void
    >({
      query: () => ({
        url: "/stats/pending-approvals",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
        // ✅ NEW: Get revenue by country
    getRevenueByCountry: builder.query<
      { success: boolean; data: CountryRevenueData },
      void
    >({
      query: () => ({
        url: "/stats/revenue-by-country",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetUserGrowthQuery,
  useGetMonthlyRevenueQuery,
  useGetRevenueByCountryQuery,
  useGetRecentActivitiesQuery,
  useGetTopServicesQuery,
  useGetPendingApprovalsQuery,
} = adminApi;