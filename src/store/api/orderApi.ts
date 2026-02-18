/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

/**
 * =========================
 * Types / Interfaces
 * =========================
 */

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type PaymentMethod = "COD" | "ONLINE";

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  tax?: number;
  shippingCharge?: number;
  discount?: number;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  orderStatus: OrderStatus;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

/**
 * =========================
 * Order API
 * =========================
 */

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    /**
     * =========================
     * POST - Create/Place Orders
     * =========================
     */

    // Place new order
    placeOrder: builder.mutation<OrderResponse, PlaceOrderPayload>({
      query: (payload) => ({
        url: "/orders",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),

    /**
     * =========================
     * GET - Retrieve Orders
     * =========================
     */

    // Get user's orders (paginated + search + filters)
    getMyOrders: builder.query<
      OrdersResponse,
      { page?: number; limit?: number; search?: string; status?: OrderStatus | "all"; paymentStatus?: PaymentStatus | "all" }
    >({
      query: ({ page = 1, limit = 10, search = "", status, paymentStatus }) => {
        let url = `/orders/my?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (status && status !== "all") url += `&status=${status}`;
        if (paymentStatus && paymentStatus !== "all") url += `&paymentStatus=${paymentStatus}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),

    // Get all orders (admin only - paginated + filters + search)
    getAllOrders: builder.query<
      OrdersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: OrderStatus | "all";
        paymentStatus?: PaymentStatus | "all";
      }
    >({
      query: ({ page = 1, limit = 10, search = "", status, paymentStatus }) => {
        let url = `/orders?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (status && status !== "all") url += `&status=${status}`;
        if (paymentStatus && paymentStatus !== "all") url += `&paymentStatus=${paymentStatus}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Order"],
    }),

    // Get order by ID
    getOrderById: builder.query<OrderResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    /**
     * =========================
     * PATCH - Update Orders
     * =========================
     */

    // Update order status (admin only)
    updateOrderStatus: builder.mutation<
      OrderResponse,
      UpdateOrderStatusPayload
    >({
      query: ({ orderId, orderStatus }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        data: { orderStatus },
      }),
      invalidatesTags: ["Order"],
    }),

    /**
     * =========================
     * DELETE - Cancel Orders
     * =========================
     */

    // Cancel order (user can cancel pending orders)
    cancelOrder: builder.mutation<OrderResponse, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),

    // Refund order (admin)
    refundOrder: builder.mutation<OrderResponse, { orderId: string; amount: number }>({
      query: ({ orderId, amount }) => ({
        url: `/orders/${orderId}/refund`,
        method: "POST",
        data: { amount },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

/**
 * =========================
 * Exported Hooks
 * =========================
 */

export const {
  // Mutations
  usePlaceOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useRefundOrderMutation,
  // Queries
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;