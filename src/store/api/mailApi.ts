import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export type MailLogStatus = "success" | "failed";

export interface MailLogRow {
  _id: string;
  meetingTitle: string;
  meetingTime: string | null;
  sentAt: string | null;
  totalUsers: number;
  status: MailLogStatus;
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
      { page?: number; limit?: number; search?: string; status?: MailLogStatus | "all" }
    >({
      query: ({ page = 1, limit = 10, search = "", status = "all" }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (status !== "all") {
          params.status = status;
        }

        return {
          url: "/mail-management/logs",
          method: "GET",
          params,
        };
      },
      providesTags: ["MailLogs"],
    }),
  }),
});

export const { useGetMailLogsQuery } = mailApi;
