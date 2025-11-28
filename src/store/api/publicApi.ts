import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: "/services",
        method: "GET",
      }),
    }),
    getPlans: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
    }),
    getTestimonials: builder.query({
      query: () => ({
        url: "/testimonials",
        method: "GET",
      }),
    }),
    getFAQ: builder.query({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
    }),
    creatConsultation: builder.mutation({
      query: (body) => ({
        url: "/consultation",
        method: "POST",
        data: body,
      }),
    }),
    newsLetter: builder.mutation({
      query: (body) => ({
        url: "/news-letter",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetPlansQuery,
  useGetTestimonialsQuery,
  useNewsLetterMutation,
  useCreatConsultationMutation,
  useGetFAQQuery,
} = publicApi;
