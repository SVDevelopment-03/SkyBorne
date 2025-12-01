// /store/api/paymentApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

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
  useCreatePaymentVerificationMutation,
  useGetPaymentStatusQuery,
} = paymentApi;
