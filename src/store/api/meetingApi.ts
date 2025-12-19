// /store/api/meetingApi.ts

export interface UpdateMeetingPayload {
  service?: string; // service ID only
  trainer?: string; // trainer ID only
  title?: string;
  regions?: IMeeting["regions"];
  liveRegion?: string;
  liveTime?: string;
  startDate?: Date;
  localTime?: string | Date;
  duration?: number;
  autoRecording?: boolean;
  rotationEnabled?: boolean;
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
  }>;
  liveRegion: string;
  liveTime: string;
  startDate: Date;
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
  { page?: number; limit?: number; search?: string }
>({
  query: ({ page = 1, limit = 10, search = "" }) => ({
    url: "/meetings/getAll",
    method: "GET",
    params: {
      page,
      limit,
      search,
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
      { id: string; body: UpdateMeetingPayload}
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
    getMeetingById: builder.query<
      { success: boolean; data: IMeeting },
      string
    >({
      query: (id) => ({
        url: `/meetings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Meetings", id }],
    }),



  }),
});

export const {
  useCreateMeetingMutation,
  useGetAllMeetingsQuery,
  useGetMeetingByIdQuery,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  useGetMeetingsQuery,
  useGetMonthlyAttendanceQuery,
  useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} = meetingApi;
