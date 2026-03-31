/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),

  // ✅ REQUIRED for invalidatesTags
  tagTypes: ["User"],

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

    socialLogin: builder.mutation({
      query: (body) => ({
        url: "/social-login",
        method: "POST",
        data: body,
      }),
    }),

    // ✅ PROVIDES User tag
    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

   getDashboardStats: builder.query({
  query: (params) => ({
    url: "/dashboardStats",
    method: "GET",
    params, // ✅ THIS sends ?region=IN
  }),
}),


    // ✅ NOW CORRECT
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/update-profile",
        method: "PUT",
        data: body,
      }),

      // ✅ This now works
      invalidatesTags: ["User"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Optional optimistic cache update
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, (draft: any) => {
              draft.user = data.data || data.user;
            })
          );
        } catch (err) {
          console.error("Error updating profile:", err);
        }
      },
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: "/change-password",
        method: "PUT",
        data: body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLazyGetMeQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
  usePasswordResetRequestMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSocialLoginMutation,
  useLoginMutation,
  useCreatePaymentMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
