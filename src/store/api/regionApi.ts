import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

// ============================================
// Types & Interfaces
// ============================================

export interface IRegion {
  _id: string;
  name: string;
  code: string;
  timezone: string;

  replayTime: string; // e.g., "10:00 AM"
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

export interface GetRegionsResponse {
  success: boolean;
  data: {
    regions: IRegion[];
    pagination: PaginationData;
  };
}

export interface GetAllRegionsResponse {
  success: boolean;
  data: IRegion[];
}

export interface CreateRegionRequest {
  name: string;
  code: string;
  timezone: string;
  displayLabel: string;
  replayTime: string;
  status?: "active" | "inactive";
}

export interface CreateRegionResponse {
  success: boolean;
  message: string;
  data: IRegion;
}

export interface UpdateRegionRequest {
  name?: string;
  code?: string;
  timezone?: string;
  displayLabel?: string;
  replayTime?: string;
  status?: "active" | "inactive";
}

export interface UpdateRegionResponse {
  success: boolean;
  message: string;
  data: IRegion;
}

export interface DeleteRegionResponse {
  success: boolean;
  message: string;
}

// ============================================
// Region API
// ============================================

export const regionApi = createApi({
  reducerPath: "regionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Regions"],

  endpoints: (builder) => ({
    // Get all regions with pagination and search
    getRegions: builder.query<
      GetRegionsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/regions",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
        },
      }),
      providesTags: ["Regions"],
    }),

    // Get all active regions (for dropdowns, no pagination)
    getAllActiveRegions: builder.query<GetAllRegionsResponse, void>({
      query: () => ({
        url: "/regions/active",
        method: "GET",
      }),
      providesTags: ["Regions"],
      keepUnusedDataFor: 0,
    }),

    // Get single region by ID
    getRegionById: builder.query<{ success: boolean; data: IRegion }, string>({
      query: (regionId) => ({
        url: `/regions/${regionId}`,
        method: "GET",
      }),
      providesTags: (result, error, regionId) => [
        { type: "Regions", id: regionId },
      ],
    }),

    // Create new region
    createRegion: builder.mutation<CreateRegionResponse, CreateRegionRequest>({
      query: (body) => ({
        url: "/create-region",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Regions"],
    }),

    // Update region (full update)
    updateRegion: builder.mutation<
      UpdateRegionResponse,
      { regionId: string; body: UpdateRegionRequest }
    >({
      query: ({ regionId, body }) => ({
        url: `/update-region/${regionId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (result, error, { regionId }) => [
        { type: "Regions", id: regionId },
        "Regions",
      ],
    }),

    // Update region status only
    updateRegionStatus: builder.mutation<
      UpdateRegionResponse,
      { regionId: string; status: "active" | "inactive" }
    >({
      query: ({ regionId, status }) => ({
        url: `/update-region/${regionId}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: (result, error, { regionId }) => [
        { type: "Regions", id: regionId },
        "Regions",
      ],
    }),

    // Delete region
    deleteRegion: builder.mutation<DeleteRegionResponse, string>({
      query: (regionId) => ({
        url: `/delete-region/${regionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Regions"],
    }),
  }),
});

export const {
  useGetRegionsQuery,
  useGetAllActiveRegionsQuery,
  useGetRegionByIdQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useUpdateRegionStatusMutation,
  useDeleteRegionMutation,
} = regionApi;
