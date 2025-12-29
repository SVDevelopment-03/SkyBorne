/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

interface FeedbackResponse {
  _id: string;
  session: string;
  trainer: {
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
  date: string;
  rating: number;
  comment: string;
  status: "submitted" | "reviewed" | "flagged";
  trainerResponse: string | null;
  createdAt: string;
}

interface FeedbackListResponse {
  success: boolean;
  data: {
    feedbacks: FeedbackResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TrainerStats {
  totalFeedback: number;
  averageRating: number;
}

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    getAllFeedback: builder.query<FeedbackListResponse, any>({
      query: ({ search = "", page = 1, limit = 10, sortBy = "-createdAt" }) => ({
        url: "/feedback",
        method: "GET",
        params: {
          search,
          page,
          limit,
          sortBy,
        },
      }),
      providesTags: ["Feedback"],
      keepUnusedDataFor: 0,
    }),
    getAllTrainerFeedback: builder.query<FeedbackListResponse, any>({
      query: ({ search = "", page = 1, limit = 10, sortBy = "-createdAt" }) => ({
        url: "/feedback",
        method: "GET",
        params: {
          search,
          page,
          limit,
          sortBy,
        },
      }),
      providesTags: ["Feedback"],
      keepUnusedDataFor: 0,
    }),

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
  useGetAllTrainerFeedbackQuery,
  useGetAllFeedbackQuery
} = feedbackApi;