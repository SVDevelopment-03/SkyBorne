import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        data: body,
      }),
    }),
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "/send-otp",
        method: "POST",
        data: body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        data: body,
      }),
    }),

    createPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        data: body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/verify-otp",
        method: "POST",
        data: body,
      }),
    }),

    passwordResetRequest: builder.mutation({
      query: (body) => ({
        url: "/request-password-reset",
        method: "POST",
        data: body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  usePasswordResetRequestMutation,
  useResetPasswordMutation,
  useLoginMutation,
  useCreatePaymentMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
