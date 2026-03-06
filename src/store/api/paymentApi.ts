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

interface RecurringPaymentFailure {
  _id: string;
  userId?: string | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  subscriptionId?: string | null;
  invoiceId?: string | null;
  status: "processing" | "cancelled";
  failedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RecurringPaymentFailuresResponse {
  success: boolean;
  failures: RecurringPaymentFailure[];
  total: number;
  filteredCount: number;
  page: number;
  limit: number;
  totalPages: number;
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

type CancelSubscriptionStatus = "pending" | "retained" | "cancelled";

interface CancelSubscriptionRecord {
  _id: string;
  subscriptionId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userId?: string;
  status: CancelSubscriptionStatus;
  description?: string;
  createdAt?: string;
  cancelledAt?: string;
  plan?: string;
}

interface CancelSubscriptionsListResponse {
  success: boolean;
  message: string;
  data: {
    cancelSubscriptions: CancelSubscriptionRecord[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
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
  country?: string;
}

interface ExportPaymentsParams {
  search?: string;
  status?: string;
  country?: string;
}

interface RecurringPaymentFailuresParams {
  search?: string;
  status?: "processing" | "cancelled" | "all";
  page?: number;
  limit?: number;
}

interface ExportCancelSubscriptionsParams {
  search?: string;
  filter?: CancelSubscriptionStatus;
}

interface CancelSubscriptionReasonRequest {
  userId: string;
  description: string;
}

interface CancelSubscriptionReasonResponse {
  success: boolean;
  message: string;
}

interface CancelSubscriptionRequest {
  userId: string;
  adminDescription: string;
}

interface UpdateCancelSubscriptionStatusRequest {
  userId: string;
  status: CancelSubscriptionStatus;
  adminDescription: string;
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
            ([, v]) => v !== undefined && v !== null && v !== ''
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
    // GET RECURRING PAYMENT FAILURES (ADMIN)
    // =======================================
    getRecurringPaymentFailures: builder.query<
      RecurringPaymentFailuresResponse,
      RecurringPaymentFailuresParams
    >({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([, v]) => v !== undefined && v !== null && v !== ""
          )
        );

        return {
          url: "/payment/admin/recurring-failures",
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
            ([, v]) => v !== undefined && v !== null && v !== ''
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
    cancelSubscription: builder.mutation<CancelSubscriptionResponse, CancelSubscriptionRequest>({
      query: ({ userId, adminDescription }) => ({
        url: `/subscription/${userId}/cancel`,
        method: "POST",
        data: { adminDescription },
      }),
      invalidatesTags: ["Payment"],
    }),

    updateCancelSubscriptionStatus: builder.mutation<
      CancelSubscriptionReasonResponse,
      UpdateCancelSubscriptionStatusRequest
    >({
      query: ({ userId, status, adminDescription }) => ({
        url: `/subscription/${userId}/status`,
        method: "PATCH",
        data: { status, adminDescription },
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
    getCancelledSubscriptions: builder.query<CancelSubscriptionsListResponse, { page?: number; limit?: number; search?: string; country?: string; filter?: CancelSubscriptionStatus }>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
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

    exportCancelSubscriptionsCSV: builder.mutation<string, ExportCancelSubscriptionsParams>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/subscription/admin/export",
          method: "GET",
          params: filteredParams,
          responseType: "text",
        };
      },
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
  useGetRecurringPaymentFailuresQuery,
  useExportPaymentsCSVMutation,
  useCancelSubscriptionMutation,
  useUpdateCancelSubscriptionStatusMutation,
  useGetAdminPaymentStatsQuery,
  useCreatePaymentVerificationMutation,
  useGetPaymentStatusQuery,
  useSendCancellationReasonMutation,
  useGetCancelledSubscriptionsQuery,
  useExportCancelSubscriptionsCSVMutation,
  useGetCardDetailsQuery,
  useCreateCardPortalSessionMutation,
} = paymentApi;
