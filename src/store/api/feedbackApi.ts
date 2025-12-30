/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface FeedbackResponse {
  _id: string;
  session?: string;
  trainer: {
    name: string;
    email: string;
  };
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  status?: "submitted" | "reviewed" | "flagged";
  trainerResponse?: string | null;
  createdAt: string;
}

interface FeedbackListResponse {
  success: boolean;
  message: string;
  data: FeedbackResponse[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

interface TrainerStats {
  totalFeedback: number;
  averageRating: number;
}

interface GetAllFeedbackParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

interface GetUserFeedbackParams extends GetAllFeedbackParams {
  userId: string;
}

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Feedback"],
  endpoints: (builder) => ({
    // Get all feedback with pagination
    getAllFeedback: builder.query<FeedbackListResponse, GetAllFeedbackParams>({
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

    // Get all trainer feedback with pagination
    getAllTrainerFeedback: builder.query<FeedbackListResponse, GetAllFeedbackParams>({
      query: ({ search = "", page = 1, limit = 10, sortBy = "-createdAt" }) => ({
        url: "/feedback/trainer",
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
    submitFeedback: builder.mutation<
      { success: boolean; message: string; data: FeedbackResponse },
      { rating: number; comment: string }
    >({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Get user's feedback with pagination
    getUserFeedback: builder.query<FeedbackListResponse, GetUserFeedbackParams>({
      query: ({ userId, search = "", page = 1, limit = 10, sortBy = "-createdAt" }) => ({
        url: `/feedback/user/${userId}`,
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

    // Update feedback status
    updateFeedbackStatus: builder.mutation<
      { success: boolean; message: string },
      { feedbackId: string; status: "submitted" | "reviewed" | "flagged" }
    >({
      query: ({ feedbackId, status }) => ({
        url: `/feedback/${feedbackId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Update trainer response
    updateTrainerResponse: builder.mutation<
      { success: boolean; message: string },
      { feedbackId: string; trainerResponse: string }
    >({
      query: ({ feedbackId, trainerResponse }) => ({
        url: `/feedback/${feedbackId}/response`,
        method: "PATCH",
        data: { trainerResponse },
      }),
      invalidatesTags: ["Feedback"],
    }),

    // Delete feedback
    deleteFeedback: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (feedbackId) => ({
        url: `/feedback/${feedbackId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const {
  useSubmitFeedbackMutation,
  useGetUserFeedbackQuery,
  useGetAllTrainerFeedbackQuery,
  useGetAllFeedbackQuery,
  useUpdateFeedbackStatusMutation,
  useUpdateTrainerResponseMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;