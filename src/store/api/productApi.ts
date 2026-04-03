/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export type ProductStatus = "active" | "inactive";

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  status: ProductStatus;
  image: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  category: string;
  price: number;
  stock?: number;
  status?: ProductStatus;
  image: string;
  description?: string;
}

export interface GetPublishedProductsParams {
  search?: string;
  categoryId?: string;
  sortBy?: "newest" | "price-low" | "price-high";
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  productId: string;
}

export interface UpdateProductStatusPayload {
  productId: string;
  status: ProductStatus;
}
export interface GetProductsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    // ✅ Fix the return type to match actual API response
    // Update query type
    getProducts: builder.query<
      { data: { products: Product[]; pagination: any } },
      GetProductsParams
    >({
      query: (params = {}) => ({
        url: "/products",
        method: "GET",
        params, // ← sends as ?search=...&status=...
      }),
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    getProductsByCategory: builder.query<Product[], string>({
      query: (categoryId) => ({
        url: `/products/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductsByStatus: builder.query<Product[], ProductStatus>({
      query: (status) => ({
        url: `/products/status/${status}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<Product, FormData | CreateProductPayload>({
      query: (payload) => ({
        url: "/create-product",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: ({ productId, ...body }) => ({
        url: `/update-product/${productId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        "Product",
        { type: "Product", id: productId },
      ],
    }),

    updateProductStatus: builder.mutation<Product, UpdateProductStatusPayload>({
      query: ({ productId, status }) => ({
        url: `/update-product-status/${productId}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        "Product",
        { type: "Product", id: productId },
      ],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `/delete-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    // Inside endpoints builder:
getPublishedProducts: builder.query<{ data: Product[] }, GetPublishedProductsParams>({
  query: (params = {}) => ({
    url: "/products/published",
    method: "GET",
    params,
  }),
  providesTags: ["Product"],
}),


  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetPublishedProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByStatusQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productApi;
