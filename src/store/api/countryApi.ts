import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

// ============================================
// Types & Interfaces
// ============================================

export interface ICountry {
  _id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetCountriesResponse {
  success: boolean;
  data: {
    countries: ICountry[];
    pagination: PaginationData;
  };
}

export interface CreateCountryRequest {
  name: string;
  code: string;
  status?: "active" | "inactive";
}

export interface CreateCountryResponse {
  success: boolean;
  message: string;
  data: ICountry;
}

export interface UpdateCountryRequest {
  name?: string;
  code?: string;
  status?: "active" | "inactive";
}

export interface UpdateCountryResponse {
  success: boolean;
  message: string;
  data: ICountry;
}

export interface DeleteCountryResponse {
  success: boolean;
  message: string;
}

// ============================================
// Country API
// ============================================

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Countries"],

  endpoints: (builder) => ({
    // Get all countries with pagination and search
    getCountries: builder.query<
      GetCountriesResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/countries",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
        },
      }),
      providesTags: ["Countries"],
    }),

    // Get single country by ID
    getCountryById: builder.query<
      { success: boolean; data: ICountry },
      string
    >({
      query: (countryId) => ({
        url: `/countries/${countryId}`,
        method: "GET",
      }),
      providesTags: (result, error, countryId) => [
        { type: "Countries", id: countryId },
      ],
    }),

    // Create new country
    createCountry: builder.mutation<
      CreateCountryResponse,
      CreateCountryRequest
    >({
      query: (body) => ({
        url: "/create-country",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Countries"],
    }),

    // Update country (full update)
    updateCountry: builder.mutation<
      UpdateCountryResponse,
      { countryId: string; body: UpdateCountryRequest }
    >({
      query: ({ countryId, body }) => ({
        url: `/update-country/${countryId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (result, error, { countryId }) => [
        { type: "Countries", id: countryId },
        "Countries",
      ],
    }),

    // Update country status only
    updateCountryStatus: builder.mutation<
      UpdateCountryResponse,
      { countryId: string; status: "active" | "inactive" }
    >({
      query: ({ countryId, status }) => ({
        url: `/update-country/${countryId}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (result, error, { countryId }) => [
        { type: "Countries", id: countryId },
        "Countries",
      ],
    }),

    // Delete country
    deleteCountry: builder.mutation<DeleteCountryResponse, string>({
      query: (countryId) => ({
        url: `/delete-country/${countryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Countries"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useUpdateCountryStatusMutation,
  useDeleteCountryMutation,
} = countryApi;