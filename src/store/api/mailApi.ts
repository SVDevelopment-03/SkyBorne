import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface MailLogRow {
  _id: string;
  meetingTitle: string;
  meetingTime: string | null;
  sentAt: string | null;
  totalUsers: number;
  status: "success" | "failed";
}

export interface MailLogListResponse {
  success: boolean;
  data: MailLogRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const mailApi = createApi({
  reducerPath: "mailApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["MailLogs"],
  endpoints: (builder) => ({
    getMailLogs: builder.query<
      MailLogListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/mail-management/logs",
        method: "GET",
        params: {
          page,
          limit,
          search,
        },
      }),
      providesTags: ["MailLogs"],
    }),
  }),
});

export const { useGetMailLogsQuery } = mailApi;
