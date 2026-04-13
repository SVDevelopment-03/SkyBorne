/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export type ProductStatus = "active" | "inactive";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  name?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface AddProductReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export interface Product {
  _id: string;
  name: string;
  category?: { _id: string; name?: string; title?: string } | string;
  price: number;
  stock?: number;
  status: ProductStatus;
  image: string;
  images?: string[];
  description?: string;
  specifications?: ProductSpecification[];
  shippingInfo?: string;
  reviews?: ProductReview[];
  productCategory?: string;
  productSubCategory?: string;
  productSubtype?: string;
  partnerSkuUniqueCode?: string;
  modelNumber?: string;
  gtinUpc?: string;
  brand?: string;
  productTitle?: string;
  colourName?: string;
  setIncludes?: string;
  featureBullet1?: string;
  featureBullet2?: string;
  featureBullet3?: string;
  featureBullet4?: string;
  featureBullet5?: string;
  whatIsInTheBox?: string;
  longDescription?: string;
  countryOfOrigin?: string;
  colourFamily?: string;
  size?: string;
  sizeUnit?: string;
  secondaryMaterial?: string;
  materialFinish?: string;
  careInstructions?: string;
  itemCondition?: string;
  grade?: string;
  productLength?: string;
  productLengthUnit?: string;
  productHeight?: string;
  productHeightUnit?: string;
  productWidthDepth?: string;
  productWidthDepthUnit?: string;
  productWeight?: string;
  productWeightUnit?: string;
  numberOfPieces?: string;
  shippingLength?: string;
  shippingLengthUnit?: string;
  shippingHeight?: string;
  shippingHeightUnit?: string;
  shippingWidthDepth?: string;
  shippingWidthDepthUnit?: string;
  shippingWeight?: string;
  shippingWeightUnit?: string;
  recommendedRetailPrice?: string;
  recommendedRetailPriceAEUnit?: string;
  hsCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  category: string;
  price: number;
  stock?: number;
  status?: ProductStatus;
  image?: string;
  imageBase64?: string;
  imageBase64s?: string[];
  imageUrls?: string[];
  images?: string[];
  description?: string;
  specifications?: ProductSpecification[];
  shippingInfo?: string;
  reviews?: ProductReview[];
  productCategory?: string;
  productSubCategory?: string;
  productSubtype?: string;
  partnerSkuUniqueCode?: string;
  modelNumber?: string;
  gtinUpc?: string;
  brand?: string;
  productTitle?: string;
  colourName?: string;
  setIncludes?: string;
  featureBullet1?: string;
  featureBullet2?: string;
  featureBullet3?: string;
  featureBullet4?: string;
  featureBullet5?: string;
  whatIsInTheBox?: string;
  longDescription?: string;
  countryOfOrigin?: string;
  colourFamily?: string;
  size?: string;
  sizeUnit?: string;
  secondaryMaterial?: string;
  materialFinish?: string;
  careInstructions?: string;
  itemCondition?: string;
  grade?: string;
  productLength?: string;
  productLengthUnit?: string;
  productHeight?: string;
  productHeightUnit?: string;
  productWidthDepth?: string;
  productWidthDepthUnit?: string;
  productWeight?: string;
  productWeightUnit?: string;
  numberOfPieces?: string;
  shippingLength?: string;
  shippingLengthUnit?: string;
  shippingHeight?: string;
  shippingHeightUnit?: string;
  shippingWidthDepth?: string;
  shippingWidthDepthUnit?: string;
  shippingWeight?: string;
  shippingWeightUnit?: string;
  recommendedRetailPrice?: string;
  recommendedRetailPriceAEUnit?: string;
  hsCode?: string;
}

export interface ProductInterest {
  _id: string;
  product?: { _id: string; name?: string };
  user?: { _id: string; firstName?: string; lastName?: string; email?: string };
  createdAt?: string;
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

export interface GetProductInterestsParams {
  search?: string;
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
    expressProductInterest: builder.mutation<
      { success: boolean; message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `/products/${productId}/interested`,
        method: "POST",
      }),
    }),
    addProductReview: builder.mutation<
      { success: boolean; message: string; data: Product },
      AddProductReviewPayload
    >({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        data: { rating, comment },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        "Product",
        { type: "Product", id: productId },
      ],
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
    getProductInterests: builder.query<
      { data: { interests: ProductInterest[]; pagination: any } },
      GetProductInterestsParams
    >({
      query: (params = {}) => ({
        url: "/product-interests",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
        },
      }),
    }),


  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetPublishedProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByStatusQuery,
  useGetProductInterestsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  useExpressProductInterestMutation,
  useAddProductReviewMutation,
} = productApi;
