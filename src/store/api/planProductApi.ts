import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export interface IPlanProduct {
  _id: string;
  planKey: string;
  displayName?: string;
  description?: string;
  price?: number;
  currency?: string;
  billingType?: "monthly" | "yearly";
  appleProductIds?: string[];
  googleProductIds?: string[];
  stripePriceIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface GetPlansResponse {
  success: boolean;
  data: IPlanProduct[];
}

export const planProductApi = createApi({
  reducerPath: "planProductApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PlanProduct"],
  endpoints: (builder) => ({
    getPlanProducts: builder.query<GetPlansResponse, void>({
      query: () => ({ url: "/plans", method: "GET" }),
      providesTags: ["PlanProduct"],
    }),

    upsertPlanProduct: builder.mutation<
      { success: boolean; message?: string; data?: any },
      Partial<IPlanProduct>
    >({
      query: (body) => ({ url: "/plans", method: "POST", data: body }),
      invalidatesTags: ["PlanProduct"],
    }),
  }),
});

export const { useGetPlanProductsQuery, useUpsertPlanProductMutation } =
  planProductApi;

export default planProductApi;
