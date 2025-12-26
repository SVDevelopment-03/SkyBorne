// store/api/feedbackApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    // Submit feedback
    submitFeedback: builder.mutation({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Get user's feedback
    getUserFeedback: builder.query({
      query: (userId) => ({
        url: `/feedback/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Feedback"],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useSubmitFeedbackMutation,
  useGetUserFeedbackQuery,
} = feedbackApi;