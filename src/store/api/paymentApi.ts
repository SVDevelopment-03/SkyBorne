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

interface CancelSubscriptionReasonRequest {
  userId: string;
  description: string;
}

interface CancelSubscriptionReasonResponse {
  success: boolean;
  message: string;
}

interface CardAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface CardBillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: CardAddress;
}

interface CardDetailsResponse {
  success: boolean;
  data: {
    customerId: string;
    hasCard: boolean;
    card: {
      paymentMethodId: string;
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
      funding?: string | null;
    } | null;
    billingDetails: CardBillingDetails;
  };
}

interface CardPortalSessionResponse {
  success: boolean;
  data: {
    customerId: string;
    url: string;
  };
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

    // ---------------------------------------
    // UPGRADE PLAN ORDER
    // ---------------------------------------
    upgradePlanOrder: builder.mutation({
      query: (body) => ({
        url: "/payment/upgrade-order",
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

    // =======================================
    // SEND CANCELLATION REASON
    // =======================================
    sendCancellationReason: builder.mutation<
      CancelSubscriptionReasonResponse,
      CancelSubscriptionReasonRequest
    >({
      query: (body) => ({
        url: "/subscription/cancel-subscription", 
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Payment"],
    }),

    // =======================================
    // GET ALL CANCELLED SUBSCRIPTIONS (ADMIN)
    // =======================================
    getCancelledSubscriptions: builder.query<AllPaymentsResponse, { page?: number; limit?: number; search?: string; country?: string }>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/subscription/getAll",
          method: "GET",
          params: filteredParams,
        };
      },
      providesTags: ["Payment"],
    }),

    getCardDetails: builder.query<CardDetailsResponse, void>({
      query: () => ({
        url: "/payment/card-details",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    createCardPortalSession: builder.mutation<CardPortalSessionResponse, { returnUrl?: string }>({
      query: (body) => ({
        url: "/payment/card-portal-session",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useCreatePaymentOrderMutation,
  useUpgradePlanOrderMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentStatsQuery,
  useGetAllPaymentsQuery,
  useExportPaymentsCSVMutation,
  useCancelSubscriptionMutation,
  useGetAdminPaymentStatsQuery,
  useCreatePaymentVerificationMutation,
  useGetPaymentStatusQuery,
  useSendCancellationReasonMutation,
  useGetCancelledSubscriptionsQuery,
  useGetCardDetailsQuery,
  useCreateCardPortalSessionMutation,
} = paymentApi;
