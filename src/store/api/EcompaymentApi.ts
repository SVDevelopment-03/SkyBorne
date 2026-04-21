/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  email?: string;
  phone?: string;
}

export interface CreateCheckoutSessionPayload {
  shippingAddress: ShippingAddress;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  orderRef: string;
}

export interface SessionDetails {
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;
  orderRef: string;
}

export type EcomPaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PopulatedOrder {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
}

export interface EcomPayment {
  _id: string;
  /** Populated in admin getAllPayments, plain string in getMyPayments */
  userId: PopulatedUser | string;
  /** Populated in admin getAllPayments */
  orderId: PopulatedOrder | any;
  customerId?: any;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  amount: number;
  amountInCents?: number;
  currency: string;
  status: EcomPaymentStatus;
  orderRef: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface GetAllPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface DownloadReceiptParams {
  paymentId: string;
}

export interface ReorderCheckoutParams {
  orderId: string;
}

export interface EcomPaymentStatsResponse {
  success: boolean;
  stats: {
    totalRevenue: number;
    thisMonth: number;
    totalTransactions: number;
  };
}

// ── API ────────────────────────────────────────────────────────────────────────

export const ecomPaymentApi = createApi({
  reducerPath: "ecomPaymentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["EcomPayment"],

  endpoints: (builder) => ({
    /** POST /ecom-payments/create-checkout-session */
    createCheckoutSession: builder.mutation<
      { data: CheckoutSessionResponse },
      CreateCheckoutSessionPayload
    >({
      query: (payload) => ({
        url: "/ecom-payments/create-checkout-session",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["EcomPayment"],
    }),

    /** POST /ecom-payments/reorder/:orderId */
    reorderCheckoutSession: builder.mutation<
      { data: CheckoutSessionResponse },
      ReorderCheckoutParams
    >({
      query: ({ orderId }) => ({
        url: `/ecom-payments/reorder/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: ["EcomPayment"],
    }),

    /** GET /ecom-payments/session/:sessionId — success page details */
    getSessionDetails: builder.query<{ data: SessionDetails }, string>({
      query: (sessionId) => ({
        url: `/ecom-payments/session/${sessionId}`,
        method: "GET",
      }),
    }),

    /** GET /ecom-payments/my — user's own payment history */
    getMyPayments: builder.query<{ data: EcomPayment[] }, void>({
      query: () => ({
        url: "/ecom-payments/my",
        method: "GET",
      }),
      providesTags: ["EcomPayment"],
    }),

    /** GET /ecom-payments — admin: all ecom payments with search, status & pagination */
    getAllPayments: builder.query<
      { data: EcomPayment[]; pagination: any },
      GetAllPaymentsParams
    >({
      query: (params = {}) => ({
        url: "/ecom-payments",
        method: "GET",
        params,
      }),
      providesTags: ["EcomPayment"],
    }),

    /** GET /ecom-payments/admin/stats — admin stats used by payment cards */
    getAdminEcomPaymentStats: builder.query<EcomPaymentStatsResponse, void>({
      query: () => ({
        url: "/ecom-payments/admin/stats",
        method: "GET",
      }),
      providesTags: ["EcomPayment"],
    }),

    /** GET /ecom-payments/:paymentId/receipt — admin: download receipt PDF */
    downloadEcomReceipt: builder.mutation<Blob, DownloadReceiptParams>({
      query: ({ paymentId }) => ({
        url: `/ecom-payments/${paymentId}/receipt`,
        method: "GET",
        responseType: "blob",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useReorderCheckoutSessionMutation,
  useGetSessionDetailsQuery,
  useGetMyPaymentsQuery,
  useGetAllPaymentsQuery,
  useGetAdminEcomPaymentStatsQuery,
  useDownloadEcomReceiptMutation,
} = ecomPaymentApi;
