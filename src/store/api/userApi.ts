
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  plan?: string;
  status: "active" | "inactive" | "blocked";
  createdAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  };
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<
      GetUsersResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/users",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Users"],
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

export const { useGetUsersQuery, useUpdateUserStatusMutation } = userApi;
