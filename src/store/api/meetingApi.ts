// /store/api/meetingApi.ts

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
  query: () => ({
    url: "/meetings/upcoming",
    method: "GET",
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

  }),
});

export const {
  useCreateMeetingMutation,
    useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} = meetingApi;
