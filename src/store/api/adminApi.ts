
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface OverviewStats {
  activeUsers: { value: number; change: number };
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

export interface RevenueByCountryRow {
  country: string;
  count: number;
  amount: number;
}

export interface RevenueByCountryData {
  rows: RevenueByCountryRow[];
  grandTotal: RevenueByCountryRow;
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

export interface AccountDeletionRequest {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  reason?: string;
  status: "requested" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  metadata?: {
    gateway?: string;
    plan?: string | null;
  };
}

export interface ReportsOverviewResponse {
  success: boolean;
  data: {
    generatedAt: string;
    range: {
      startDate: string;
      endDate: string;
    };
    summary: {
      users: {
        total: number;
        active: number;
        inactive: number;
      };
      customers: {
        total: number;
      };
      meetings: {
        total: number;
        upcoming: number;
        completed: number;
      };
      orders: {
        total: number;
        paid: number;
      };
      finance: {
        totalRevenue: number;
      };
      emails: {
        sent: number;
      };
      plans: {
        active: number;
        subscriptions: {
          ACTIVE: number;
          EXPIRED: number;
          CANCELLED: number;
        };
      };
    };
    monthlyRevenue: Array<{
      month: string;
      label: string;
      total: number;
      count: number;
    }>;
  };
}

export interface CreditReportItem {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  subscriptionStatus: string;
  billingType: string;
  pendingPlan: string;
  pendingBillingType: string;
  pendingEffectiveDate: string | null;
  purchasedCredits: {
    yoga: number;
    zumba: number;
    specialty: number;
    total: number;
  };
  usedCredits: {
    yoga: number;
    zumba: number;
    specialty: number;
    total: number;
  };
  remainingCredits: {
    yoga: number;
    zumba: number;
    specialty: number;
    total: number;
  };
  createdAt: string | null;
}

export interface CreditReportResponse {
  success: boolean;
  data: {
    summary: {
      totalUsers: number;
      activeUsers: number;
      pendingPlans: number;
      totalPurchasedCredits: number;
      totalUsedCredits: number;
      totalRemainingCredits: number;
      subscriptionCounts: {
        active: number;
        inactive: number;
        suspended: number;
        cancelled: number;
        expired: number;
      };
    };
    items: CreditReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
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
  tagTypes: ["AdminStats", "DeletionRequests", "Reports"],

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

    // Get revenue grouped by country
    getRevenueByCountry: builder.query<
      { success: boolean; data: RevenueByCountryData },
      void
    >({
      query: () => ({
        url: "/stats/revenue-by-country",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // Get account deletion requests
    getAccountDeletionRequests: builder.query<
      DeletionRequestsResponse,
      {
        page?: number;
        limit?: number;
        status?: "all" | "requested" | "approved" | "rejected";
      }
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

    approveAccountDeletionRequest: builder.mutation<
      { success: boolean; message: string; data: AccountDeletionRequest },
      string
    >({
      query: (requestId) => ({
        url: `/account-deletion-requests/${requestId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["DeletionRequests", "AdminStats"],
    }),

    rejectAccountDeletionRequest: builder.mutation<
      { success: boolean; message: string; data: AccountDeletionRequest },
      { requestId: string; reason?: string }
    >({
      query: ({ requestId, reason }) => ({
        url: `/account-deletion-requests/${requestId}/reject`,
        method: "POST",
        data: reason ? { reason } : undefined,
      }),
      invalidatesTags: ["DeletionRequests", "AdminStats"],
    }),

    deleteAccountDeletionRequest: builder.mutation<
      { success: boolean; message: string; data: AccountDeletionRequest },
      string
    >({
      query: (requestId) => ({
        url: `/account-deletion-requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeletionRequests", "AdminStats"],
    }),

    getReportsOverview: builder.query<
      ReportsOverviewResponse,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/reports/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    exportReportsCsv: builder.mutation<
      Blob,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/reports/export/csv",
        method: "GET",
        params,
        responseType: "blob",
      }),
    }),

    getCreditReport: builder.query<
      CreditReportResponse,
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: (params) => ({
        url: "/reports/credits",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    exportCreditReportCsv: builder.mutation<
      Blob,
      { search?: string; status?: string }
    >({
      query: (params) => ({
        url: "/reports/credits/export/csv",
        method: "GET",
        params,
        responseType: "blob",
      }),
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
  useGetAccountDeletionRequestsQuery,
  useApproveAccountDeletionRequestMutation,
  useRejectAccountDeletionRequestMutation,
  useDeleteAccountDeletionRequestMutation,
  useGetReportsOverviewQuery,
  useExportReportsCsvMutation,
  useGetCreditReportQuery,
  useExportCreditReportCsvMutation,
} = adminApi;
