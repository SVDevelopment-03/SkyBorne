import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  countryCode?: string;
  plan?: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

export interface GetAllUsersExportResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  state?: string;
  plan?: string;
}

export interface ExportUsersParams {
  search?: string;
  country?: string;
  state?: string;
  plan?: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersParams>({
      query: (params) => {
        // Filter out undefined/null/empty values from params
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/users",
          method: "GET",
          params: filteredParams,
        };
      },
      providesTags: ["Users"],
    }),

    // =======================================
    // NEW: GET ALL USERS FOR EXPORT (NO PAGINATION)
    // =======================================
     // Export users as CSV (returns blob)
    exportUsersCSV: builder.mutation<Blob, ExportUsersParams>({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params || {}).filter(
            ([, v]) => v !== undefined && v !== null && v !== ''
          )
        );

        return {
          url: "/user-export",
          method: "GET",
          params: filteredParams,
          responseType: "blob", // Important: tells axios to expect binary data
        };
      },
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; message: string },
      { userId: string; status: "active" | "inactive" }
    >({
      query: ({ userId, status }) => ({
        url: `/update-user/${userId}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        "Users",
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useExportUsersCSVMutation,
  useUpdateUserStatusMutation,
} = userApi;
