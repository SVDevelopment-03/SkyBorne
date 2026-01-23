/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

interface AllPaymentsResponse {
  success: boolean;
  payments: any[];
  total: number;
  filteredCount?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  currentFilters?: {
    status?: string;
    search?: string;
  };
}

interface Subscription {
  _id: string;
  userId: string;
  plan: string;
  status: 'active' | 'cancelled' | 'suspended' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: Subscription;
}

interface PaymentStatsResponse {
  success: boolean;
  stats: {
    totalSpent?: number;
    thisMonth?: number;
    lastPaymentAmount?: number;
    totalCount?: number;
    completedCount?: number;
    failedCount?: number;
    pendingCount?: number;
    successRate?: number;
    averageTransactionValue?: number;
    activeSubscriptions?: number;
    totalRevenue?: number;
  };
}

interface AllPaymentsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  country?: string;
}

interface ExportPaymentsParams {
  search?: string;
  status?: string;
  country?: string;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    
    // ---------------------------------------
    // CREATE PAYMENT ORDER
    // ---------------------------------------
    createPaymentOrder: builder.mutation({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Payment"],
    }),

    // =======================================
    // GET PAYMENT HISTORY
    // =======================================
    getPaymentHistory: builder.query({
      query: (userId) => ({
        url: `/payment/history/${userId}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // =======================================
    // GET PAYMENT STATS
    // =======================================
    getPaymentStats: builder.query({
      query: (userId) => ({
        url: `/payment/stats/${userId}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // =======================================
    // GET ALL PAYMENTS (ADMIN)
    // =======================================
    getAllPayments: builder.query<AllPaymentsResponse, AllPaymentsParams>({
      query: (params) => {
        // Filter out undefined/null/empty values from params
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/payment/admin/all",
          method: "GET",
          params: filteredParams,
        };
      },
      providesTags: ["Payment"],
    }),

    // =======================================
    // GET ADMIN PAYMENT STATS
    // =======================================
    getAdminPaymentStats: builder.query<PaymentStatsResponse, void>({
      query: () => ({
        url: "/payment/admin/stats",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // =======================================
    // EXPORT PAYMENTS AS CSV
    // =======================================
    exportPaymentsCSV: builder.mutation<string, ExportPaymentsParams>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/payment/admin/export",
          method: "GET",
          params: filteredParams,
          responseType: "text", // Expect CSV text
        };
      },
    }),

    // =======================================
    // CANCEL SUBSCRIPTION
    // =======================================
    cancelSubscription: builder.mutation<CancelSubscriptionResponse, string>({
      query: (userId) => ({
        url: `/subscription/${userId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),

    // ---------------------------------------
    // GET PAYMENT STATUS
    // ---------------------------------------
    getPaymentStatus: builder.query({
      query: (orderRef) => ({
        url: `/payment/status/${orderRef}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // ---------------------------------------
    // VERIFY PAYMENT
    // ---------------------------------------
    createPaymentVerification: builder.mutation({
      query: (body) => ({
        url: "/payment/verify-payment",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreatePaymentOrderMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentStatsQuery,
  useGetAllPaymentsQuery,
  useExportPaymentsCSVMutation,
  useCancelSubscriptionMutation,
  useGetAdminPaymentStatsQuery,
  useCreatePaymentVerificationMutation,
  useGetPaymentStatusQuery,
} = paymentApi;