import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface IAdminPlan {
  _id: string;
  name: string;
  services: string[];
  serviceClassCounts?: Array<{
    service: string;
    classCountPerMonth: number;
  }>;
  price: number;
  classCountPerMonth: number;
  description?: string;
  features?: string[];
  image?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanPayload {
  name: string;
  services: string[];
  price: number;
  classCountPerMonth?: number;
  serviceClassCounts?: Array<{
    service: string;
    classCountPerMonth: number;
  }>;
  description?: string;
  features?: string[];
  image?: string;
  isActive?: boolean;
  order?: number;
}

interface AdminPlanListResponse {
  success: boolean;
  message?: string;
  data: {
    plans: IAdminPlan[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}

export const planApi = createApi({
  reducerPath: "planApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Plan"],
  endpoints: (builder) => ({
    getAdminPlans: builder.query<
      AdminPlanListResponse,
      { search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/plans",
        method: "GET",
        params: {
          search: params?.search || "",
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
      }),
      providesTags: ["Plan"],
    }),

    getAdminPlanById: builder.query<
      { success: boolean; data: IAdminPlan; message?: string },
      string
    >({
      query: (planId) => ({
        url: `/admin/plans/${planId}`,
        method: "GET",
      }),
      providesTags: (result, error, planId) => [{ type: "Plan", id: planId }],
    }),

    createPlan: builder.mutation<
      { success: boolean; data: IAdminPlan; message?: string },
      PlanPayload
    >({
      query: (body) => ({
        url: "/admin/plans",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Plan"],
    }),

    updatePlan: builder.mutation<
      { success: boolean; data: IAdminPlan; message?: string },
      { planId: string; body: PlanPayload }
    >({
      query: ({ planId, body }) => ({
        url: `/admin/plans/${planId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: "Plan", id: planId },
        "Plan",
      ],
    }),

    updatePlanStatus: builder.mutation<
      { success: boolean; data: IAdminPlan; message?: string },
      { planId: string; isActive: boolean }
    >({
      query: ({ planId, isActive }) => ({
        url: `/admin/plans/${planId}/status`,
        method: "PATCH",
        data: { isActive },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: "Plan", id: planId },
        "Plan",
      ],
    }),
  }),
});

export const {
  useGetAdminPlansQuery,
  useGetAdminPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useUpdatePlanStatusMutation,
} = planApi;
