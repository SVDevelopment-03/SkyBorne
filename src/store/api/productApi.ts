/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

/**
 * =========================
 * Types / Interfaces
 * =========================
 */

export type ProductStatus = "Published" | "Draft";

export interface Product {
  _id: string;
  name: string;
  sku: string;
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
  sku: string;
  category: string;
  price: number;
  stock?: number;
  status?: ProductStatus;
  image: string;
  description?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  productId: string;
}

export interface UpdateProductStatusPayload {
  productId: string;
  status: ProductStatus;
}

/**
 * =========================
 * Product API
 * =========================
 */

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    /**
     * =========================
     * GET
     * =========================
     */

    // Get all products
    getProducts: builder.query<Product[], void>({
      query: ({page,
    limit}:any) => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Get published products
    getPublishedProducts: builder.query<Product[], void>({
      query: () => ({
        url: "/products/published",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Get product by ID
    getProductById: builder.query<Product, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Get products by category
    getProductsByCategory: builder.query<Product[], string>({
      query: (categoryId) => ({
        url: `/products/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Get product by SKU
    getProductBySku: builder.query<Product, string>({
      query: (sku) => ({
        url: `/products/sku/${sku}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Get products by status
    getProductsByStatus: builder.query<Product[], ProductStatus>({
      query: (status) => ({
        url: `/products/status/${status}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    /**
     * =========================
     * POST
     * =========================
     */

    // Create product
    createProduct: builder.mutation<Product, FormData>({
      query: (payload) => ({
        url: "/create-product",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Product"],
    }),

    /**
     * =========================
     * PUT / PATCH
     * =========================
     */

    // Update full product
    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: ({ productId, ...body }) => ({
        url: `/update-product/${productId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    // Update product status only
    updateProductStatus: builder.mutation<
      Product,
      UpdateProductStatusPayload
    >({
      query: ({ productId, status }) => ({
        url: `/update-product-status/${productId}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    /**
     * =========================
     * DELETE
     * =========================
     */

    // Delete product
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `/delete-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getUploadUrl: builder.query<{ uploadUrl: string }, { fileName: string; fileType: string }>({
      query: ({ fileName, fileType }) => ({
        url: `product-image-upload-url?fileName=${fileName}&fileType=${fileType}`,
        method: "GET",
      }),
    }),
  }),
});

/**
 * =========================
 * Hooks
 * =========================
 */

export const {
  useGetProductsQuery,
  useGetPublishedProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetProductBySkuQuery,
  useGetProductsByStatusQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productApi;
