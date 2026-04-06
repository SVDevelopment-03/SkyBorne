import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface EcomCategory {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetEcomCategoriesResponse {
  success: boolean;
  data: {
    categories: EcomCategory[];
    pagination: PaginationData;
  };
}

export interface GetActiveEcomCategoriesResponse {
  success: boolean;
  data: EcomCategory[];
}

export interface CreateEcomCategoryRequest {
  name: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface CreateEcomCategoryResponse {
  success: boolean;
  message: string;
  data: EcomCategory;
}

export interface UpdateEcomCategoryRequest {
  name?: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface UpdateEcomCategoryResponse {
  success: boolean;
  message: string;
  data: EcomCategory;
}

export interface DeleteEcomCategoryResponse {
  success: boolean;
  message: string;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["EcomCategory"],

  endpoints: (builder) => ({
    getEcomCategories: builder.query<
      GetEcomCategoriesResponse,
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: (params = {}) => ({
        url: "/ecom-categories",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          status: params.status || "",
        },
      }),
      providesTags: ["EcomCategory"],
    }),

    getActiveEcomCategories: builder.query<GetActiveEcomCategoriesResponse, void>({
      query: () => ({
        url: "/ecom-categories/active",
        method: "GET",
      }),
      providesTags: ["EcomCategory"],
      keepUnusedDataFor: 0,
    }),

    getEcomCategoryById: builder.query<{ success: boolean; data: EcomCategory }, string>({
      query: (categoryId) => ({
        url: `/ecom-categories/${categoryId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, categoryId) => [
        { type: "EcomCategory", id: categoryId },
      ],
    }),

    createEcomCategory: builder.mutation<CreateEcomCategoryResponse, CreateEcomCategoryRequest>({
      query: (body) => ({
        url: "/create-ecom-category",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["EcomCategory"],
    }),

    updateEcomCategory: builder.mutation<
      UpdateEcomCategoryResponse,
      { categoryId: string; body: UpdateEcomCategoryRequest }
    >({
      query: ({ categoryId, body }) => ({
        url: `/update-ecom-category/${categoryId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "EcomCategory", id: categoryId },
        "EcomCategory",
      ],
    }),

    updateEcomCategoryStatus: builder.mutation<
      UpdateEcomCategoryResponse,
      { categoryId: string; status: "active" | "inactive" }
    >({
      query: ({ categoryId, status }) => ({
        url: `/update-ecom-category-status/${categoryId}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "EcomCategory", id: categoryId },
        "EcomCategory",
      ],
    }),

    deleteEcomCategory: builder.mutation<DeleteEcomCategoryResponse, string>({
      query: (categoryId) => ({
        url: `/delete-ecom-category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EcomCategory"],
    }),
  }),
});

export const {
  useGetEcomCategoriesQuery,
  useGetActiveEcomCategoriesQuery,
  useGetEcomCategoryByIdQuery,
  useCreateEcomCategoryMutation,
  useUpdateEcomCategoryMutation,
  useUpdateEcomCategoryStatusMutation,
  useDeleteEcomCategoryMutation,
} = categoryApi;
