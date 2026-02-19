/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

// ── API ────────────────────────────────────────────────────────────────────────

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Cart"],

  endpoints: (builder) => ({
    /** GET /cart — fetch the current user's cart */
    getMyCart: builder.query<{ data: Cart }, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    /** POST /cart — add a product (or increase qty if already in cart) */
    addToCart: builder.mutation<{ data: Cart }, AddToCartPayload>({
      query: (payload) => ({
        url: "/cart",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    /** PATCH /cart/:productId — set a specific quantity for a cart item */
    updateCartItem: builder.mutation<{ data: Cart }, UpdateCartItemPayload>({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PATCH",
        data: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    /** DELETE /cart/:productId — remove a single item from cart */
    removeFromCart: builder.mutation<{ data: Cart }, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    /** DELETE /cart/clear — wipe the entire cart */
    clearCart: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;