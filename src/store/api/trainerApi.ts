import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export type TrainerData = {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  phoneNumber: string;
  specialization?: {
    _id: string;
    title: string;
  };
  experience: number;
  image?: string;
  charges: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TrainerApiData = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization?: string;
  experience: number;
  image?: string;
  charges: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TrainerStatus = { status: "active" | "inactive" };

export interface PaginatedResponse {
  success: boolean;
  message: string;
  data: TrainerData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface GetTrainersParams {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
}

// Dashboard Types
export interface TrainerStats {
  sessionsThisMonth: { value: number; change: number };
  monthlyEarnings: { value: number; change: number };
  activeStudents: { value: number; change: number };
  completionRate: { value: number; change: number };
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface TrainerStatsResponse {
  success: boolean;
  data: TrainerStats;
}

export interface ChartDataResponse {
  success: boolean;
  data: ChartData;
}

export interface TopService {
  service: string;
  count: number;
}

export interface TopServicesResponse {
  success: boolean;
  data: TopService[];
}

export interface PeriodParams {
  period: "3months" | "6months" | "1year";
}

export interface GrowthPeriodParams {
  period: "week" | "month" | "quarter";
}

export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Trainer",
    "TrainerStats",
    "TrainerEarnings",
    "StudentGrowth",
    "SessionsAttendance",
    "TopServices",
  ],
  endpoints: (builder) => ({
    // ============================================
    // TRAINER MANAGEMENT ENDPOINTS
    // ============================================

    // GET Trainers (Paginated + Search)
    getTrainers: builder.query<PaginatedResponse, GetTrainersParams>({
      query: ({ page, limit, search, filter }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.append("search", search);
        if (filter) params.append("filter", filter);

        return {
          url: `/trainers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Trainer"],
    }),
     getActiveTrainers: builder.query<PaginatedResponse, GetTrainersParams>({
      query: ({ page, limit, search, filter }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.append("search", search);
        if (filter) params.append("filter", filter);

        return {
          url: `/active-trainers?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Trainer"],
    }),

    // GET Single Trainer by ID
    getTrainerById: builder.query<{ data: TrainerData }, string>({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: "GET",
      }),
      providesTags: ["Trainer"],
    }),

    // CREATE Trainer
    createTrainer: builder.mutation<
      { data: TrainerApiData },
      Partial<TrainerApiData>
    >({
      query: (data) => ({
        url: "/create-trainer",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Trainer"],
    }),

    // UPDATE Trainer
    updateTrainer: builder.mutation<
      { data: TrainerApiData | TrainerStatus },
      { id: string; data: Partial<TrainerApiData | TrainerStatus> }
    >({
      query: ({ id, data }) => ({
        url: `/update-trainer/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Trainer"],
    }),

    // DELETE Trainer
    deleteTrainer: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/delete-trainer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trainer"],
    }),

    // ============================================
    // TRAINER DASHBOARD ENDPOINTS
    // ============================================

    // GET Trainer Statistics (Overview)
    getTrainerStats: builder.query<TrainerStatsResponse, void>({
      query: () => ({
        url: "/trainer/stats",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["TrainerStats"],
    }),

    // GET Trainer Earnings Over Time
    getTrainerEarnings: builder.query<ChartDataResponse, PeriodParams>({
      query: ({ period }) => ({
        url: `/trainer/earnings?period=${period}`,
        method: "GET",
      }),
      providesTags: ["TrainerEarnings"],
    }),

    // GET Student Growth Over Time
    getStudentGrowth: builder.query<ChartDataResponse, GrowthPeriodParams>({
      query: ({ period }) => ({
        url: `/trainer/student-growth?period=${period}`,
        method: "GET",
      }),
      providesTags: ["StudentGrowth"],
    }),

    // GET Sessions Attendance Rates
    getSessionsAttendance: builder.query<ChartDataResponse, PeriodParams>({
      query: ({ period }) => ({
        url: `/trainer/sessions-attendance?period=${period}`,
        method: "GET",
      }),
      providesTags: ["SessionsAttendance"],
    }),

    // GET Top Services by Trainer
    getTopServices: builder.query<TopServicesResponse, void>({
      query: () => ({
        url: "/trainer/top-services",
        method: "GET",
      }),
      providesTags: ["TopServices"],
    }),

    // ============================================
    // UTILITY MUTATIONS
    // ============================================

    // Invalidate all trainer dashboard data
    invalidateTrainerDashboard: builder.mutation<void, void>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: [
        "TrainerStats",
        "TrainerEarnings",
        "StudentGrowth",
        "SessionsAttendance",
        "TopServices",
      ],
    }),
  }),
});

export const {
  // Trainer Management Hooks
  useGetTrainersQuery,
  useGetActiveTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,

  // Dashboard Hooks
  useGetTrainerStatsQuery,
  useGetTrainerEarningsQuery,
  useGetStudentGrowthQuery,
  useGetSessionsAttendanceQuery,
  useGetTopServicesQuery,
  useInvalidateTrainerDashboardMutation,
} = trainerApi;
