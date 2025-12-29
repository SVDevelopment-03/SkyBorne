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
    // ✅ NEW: GET ALL PAYMENTS (ADMIN)
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

     getAdminPaymentStats: builder.query<PaymentStatsResponse, void>({
      query: () => ({
        url: "/payment/admin/stats",
        method: "GET",
      }),
      providesTags: ["Payment"],
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
  useGetAdminPaymentStatsQuery,
  useCreatePaymentVerificationMutation,
  useGetPaymentStatusQuery,
} = paymentApi;
