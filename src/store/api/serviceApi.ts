// src/store/api/serviceApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

/* =======================
   Types
======================= */

export interface IService {
  _id: string;
  title: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateServiceRequest {
  title: string;
}

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    // GET SERVICES (Admin)
    getServices: builder.query<
      ApiResponse<IService[]>,
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/services",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Service"],
    }),

    // CREATE SERVICE
    createService: builder.mutation<ApiResponse<IService>, CreateServiceRequest>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation<
      ApiResponse<IService>,
      { serviceId: string; title: string }
    >({
      query: ({ serviceId, title }) => ({
        url: `/services/${serviceId}`,
        method: "PUT",
        data: { title },
      }),
      invalidatesTags: ["Service"],
    }),


    // UPDATE STATUS
    updateServiceStatus: builder.mutation<
      ApiResponse<IService>,
      { serviceId: string; isActive: boolean }
    >({
      query: ({ serviceId, isActive }) => ({
        url: `/services/${serviceId}/status`,
        method: "PATCH",
        data: { isActive },
      }),
      invalidatesTags: ["Service"],
    }),

    // DELETE SERVICE
    deleteService: builder.mutation<ApiResponse<null>, string>({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useUpdateServiceStatusMutation,
  useDeleteServiceMutation,
} = serviceApi;
