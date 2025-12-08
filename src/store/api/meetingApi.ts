// /store/api/meetingApi.ts

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

  }),
});

export const {
  useCreateMeetingMutation,
  useGetAllMeetingsQuery,
  useGetMonthlyAttendanceQuery,
  useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} = meetingApi;
