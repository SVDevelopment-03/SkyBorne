// /store/api/trainerApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Trainers"],

  endpoints: (builder) => ({
    
    // ---------------------------------------
    // CREATE TRAINER
    // ---------------------------------------
    createTrainer: builder.mutation({
      query: (body) => ({
        url: "/trainer/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Trainers"],
    }),

    // ---------------------------------------
    // GET ALL TRAINERS
    // ---------------------------------------
    getTrainers: builder.query({
      query: () => ({
        url: "/trainers",
        method: "GET",
      }),
      providesTags: ["Trainers"],
    }),

    // ---------------------------------------
    // GET TRAINER BY ID
    // ---------------------------------------
    getTrainerById: builder.query({
      query: (id: string) => ({
        url: `/trainers/${id}`,
        method: "GET",
      }),
      providesTags: ["Trainers"],
    }),

    // ---------------------------------------
    // UPDATE TRAINER
    // ---------------------------------------
    updateTrainer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/trainers/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["Trainers"],
    }),

    // ---------------------------------------
    // DELETE TRAINER
    // ---------------------------------------
    deleteTrainer: builder.mutation({
      query: (id: string) => ({
        url: `/trainers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trainers"],
    }),

  }),
});

export const {
  useCreateTrainerMutation,
  useGetTrainersQuery,
  useGetTrainerByIdQuery,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} = trainerApi;
