
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface OverviewStats {
  activeUsers: { value: number; change: number };
  totalRevenue: { value: number; change: number };
  monthlyRevenue: { value: number; change: number };
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
  activeUsers: number;
}

export interface RevenueByCountryResponse {
  success: boolean;
  data: {
    rows: CountryRevenueRow[];
    grandTotal: CountryRevenueRow;
  };
}

export interface AccountDeletionRequest {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  reason?: string;
  status: "requested" | "processed";
  requestedAt: string;
  processedAt?: string | null;
  metadata?: {
    gateway?: string;
    plan?: string | null;
  };
}

export interface DeletionRequestsResponse {
  success: boolean;
  data: {
    items: AccountDeletionRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminStats", "DeletionRequests"],

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

    // Get revenue by country
    getRevenueByCountry: builder.query<RevenueByCountryResponse, void>({
      query: () => ({
        url: "/stats/revenue-by-country",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // Get account deletion requests
    getAccountDeletionRequests: builder.query<
      DeletionRequestsResponse,
      { page?: number; limit?: number; status?: "all" | "requested" | "processed" }
    >({
      query: (params) => ({
        url: "/account-deletion-requests",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || "all",
        },
      }),
      providesTags: ["DeletionRequests"],
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetUserGrowthQuery,
  useGetMonthlyRevenueQuery,
  useGetRecentActivitiesQuery,
  useGetTopServicesQuery,
  useGetPendingApprovalsQuery,
  useGetRevenueByCountryQuery,
  useGetAccountDeletionRequestsQuery,
} = adminApi;
