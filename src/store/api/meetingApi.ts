/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UpdateMeetingPayload {
  service?: string; // service ID only
  trainer?: string; // trainer ID only
  title?: string;
  regions?: IMeeting["regions"];
  liveRegion?: string;
  liveTime?: string;
  startDate?: Date;
  weeklyEndDate?: Date;
  localTime?: string | Date;
  duration?: number;
  autoRecording?: boolean;
  rotationEnabled?: boolean;
  recurringClass?: boolean;
  recurrenceType?: "weekly" | "monthly" | "custom" | "bi-weekly" | null;
  customDays?: number[] | null;
}

export interface IMeeting {
  _id: string;
  zoomMeetingId: number;
  service: {
    _id: string;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
  };
  title: string;
  regions: Array<{
    region: string;
    localTime: string;
    timezone: string;
    mode: "live" | "replay";
    date?: string;
  }>;
  liveRegion: string;
  liveTime: string;
  startDate: Date;
  weeklyEndDate?: Date;
  localTime: Date;
  trainer: {
    _id: string;
    name: string;
    email: string;
  };
  duration: number;
  autoRecording: boolean;
  rotationEnabled: boolean;
  isLive: boolean;
  joinUrl: string;
  startUrl: string;
  recordingUrl: string;
  createdBy: string;
  status: "active" | "inactive";
  recurringClass?: boolean;
  recurrenceType?: "weekly" | "monthly" | "custom" | "bi-weekly" | null;
  customDays?: number[] | null;
}

export interface GetMeetingsResponse {
  success: boolean;
  data: {
    meetings: IMeeting[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface MonthlyAttendanceData {
  month: string;
  count: number;
}

export interface MonthlyAttendanceResponse {
  success: boolean;
  data: MonthlyAttendanceData[];
}

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const meetingApi = createApi({
  reducerPath: "meetingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Meetings"],

  endpoints: (builder) => ({
    // ---------------------------------------
    // CREATE MEETING (Admin)
    // ---------------------------------------
    createMeeting: builder.mutation({
      query: (body) => ({
        url: "/meetings/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Meetings"],
    }),

    // ---------------------------------------
    // UPCOMING MEETINGS
    // ---------------------------------------
    getUpcomingMeetings: builder.query({
      query: ({ region, search }) => ({
        url: "/meetings/upcoming",
        method: "GET",
        params: {
          region,
          search,
        },
      }),
      providesTags: ["Meetings"],
    }),
    getAllUserMeetings: builder.query({
      query: ({ region, search,limit=10 }) => ({
        url: "/meetings/all",
        method: "GET",
        params: {
          region,
          search,
          limit:limit ?? 10
        },
      }),
      providesTags: ["Meetings"],
    }),
    // For trainers - fetch their assigned sessions (NEW)
    getTrainerUpcomingMeetings: builder.query({
      query: ({ search = "", date }) => ({
        url: "/meetings/trainer/upcoming", // New endpoint
        method: "GET",
        params: {
          search,
          date,
        },
      }),
      providesTags: ["Meetings"],
    }),
    getAllMeetings: builder.query({
      query: (data) => ({
        url: "/meetings/getAll",
        method: "GET",
        params: data,
      }),
      providesTags: ["Meetings"],
    }),

    // Add this to your endpoints builder:
    getMeetings: builder.query<
      GetMeetingsResponse,
      { page?: number; limit?: number; search?: string; filter?: string }
    >({
      query: ({ page = 1, limit = 10, search = "", filter = "" }) => ({
        url: "/meetings/getAll",
        method: "GET",
        params: {
          page,
          limit,
          search,
          filter,
        },
      }),
      providesTags: ["Meetings"],
    }),

    // ---------------------------------------
    // JOIN MEETING
    // ---------------------------------------
    joinMeeting: builder.mutation({
      query: (body) => ({
        url: "/meetings/join",
        method: "POST",
        data: body,
      }),
    }),
    // ---------------------------------------
    // LEAVE MEETING
    // ---------------------------------------
    leaveMeeting: builder.mutation({
      query: (body) => ({
        url: "/meetings/leave",
        method: "POST",
        data: body,
      }),
    }),
    getMonthlyAttendance: builder.query<
      MonthlyAttendanceResponse,
      { period: "3months" | "6months" | "1year" }
    >({
      query: (params) => ({
        url: "/meetings/attendance/monthly",
        method: "GET",
        params: {
          period: params.period,
        },
      }),
      // Optional: cache for 1 hour
      keepUnusedDataFor: 3600,
    }),
    // NEW: Update Meeting
    updateMeeting: builder.mutation<
      { success: boolean; data: { meeting: IMeeting; message: string } },
      { id: string; body: UpdateMeetingPayload }
    >({
      query: ({ id, body }) => ({
        url: `/meetings/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Meetings", id },
        "Meetings",
      ],
    }),

    // NEW: Delete Meeting
    deleteMeeting: builder.mutation<
      { success: boolean; message: string; data: { meetingId: string } },
      string
    >({
      query: (id) => ({
        url: `/meetings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meetings"],
    }),
    // NEW: Get Meeting by ID
    getMeetingById: builder.query<{ success: boolean; data: IMeeting }, string>(
      {
        query: (id) => ({
          url: `/meetings/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Meetings", id }],
      }
    ),
  getAllTrainerMeetings: builder.query({
  query: ({ 
    search = "", 
    page = 1,
    limit = 10,
    sortBy = "localTime",
    sortOrder = "asc",
    service,
    isLive,
    isRecurring,
    startDate,
    endDate,
  }) => {
    const params: any = {
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    };

    // Only add optional params if they're provided
    if (service) params.service = service;
    if (isLive !== undefined) params.isLive = isLive;
    if (isRecurring !== undefined) params.isRecurring = isRecurring;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return {
      url: "/meetings/getAllTrainerMeetings",
      method: "GET",
      params,
    };
  },
  providesTags: ["Meetings"],
}),

  }),
});

export const {
  useCreateMeetingMutation,
  useGetAllMeetingsQuery,
  useGetMeetingByIdQuery,
  useGetAllUserMeetingsQuery,
  useUpdateMeetingMutation,
  useGetAllTrainerMeetingsQuery,
  useGetTrainerUpcomingMeetingsQuery,
  useDeleteMeetingMutation,
  useGetMeetingsQuery,
  useGetMonthlyAttendanceQuery,
  useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} = meetingApi;
