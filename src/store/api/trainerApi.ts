import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export type TrainerData = {
  _id: string;
  name: string;
  email: string;
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
}

export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Trainer"],
  endpoints: (builder) => ({
    // GET Trainers (Paginated + Search)
    getTrainers: builder.query<PaginatedResponse, GetTrainersParams>({
      query: ({ page, limit, search }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) params.append("search", search);

        return {
          url: `/trainers?${params.toString()}`,
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
    createTrainer: builder.mutation<{ data: TrainerApiData }, Partial<TrainerApiData>>({
      query: (data) => ({
        url: "/create-trainer",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Trainer"],
    }),

    // UPDATE Trainer
    updateTrainer: builder.mutation<
      { data: TrainerApiData },
      { id: string; data: Partial<TrainerApiData> }
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
  }),
});

export const {
  useGetTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} = trainerApi;
