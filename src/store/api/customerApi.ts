import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

/**
 * =========================
 * Types / Interfaces
 * =========================
 */

export interface Address {
  postalCode: any;
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Customer {

  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orders: any[];
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payloads
 */
export interface AddAddressPayload {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault?: boolean;
}

/**
 * Response Types
 */
export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
  message?: string;
}

/**
 * =========================
 * Customer API
 * =========================
 */

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Customer"],

  endpoints: (builder) => ({
    /**
     * =========================
     * GET
     * =========================
     */

    // Get my customer profile
    getMyCustomerProfile: builder.query<CustomerResponse, void>({
      query: () => ({
        url: "/customers/me",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),

    // Admin: get all customers with search and pagination
    getAllCustomers: builder.query<
      CustomersResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => {
        let url = `/customers?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Customer"],
    }),

    /**
     * =========================
     * POST
     * =========================
     */

    // Add new address
    addAddress: builder.mutation<CustomerResponse, AddAddressPayload>({
      query: (body) => ({
        url: "/customers/address",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Customer"],
    }),

    /**
     * =========================
     * DELETE
     * =========================
     */

    // Remove address
    removeAddress: builder.mutation<CustomerResponse, string>({
      query: (addressId) => ({
        url: `/customers/address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),

        // Get single customer by id (admin)
    getCustomerById: builder.query<CustomerResponse, string>({
      query: (customerId) => ({
        url: `/customers/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
  }),
});

/**
 * =========================
 * Exported Hooks
 * =========================
 */

export const {
  useGetMyCustomerProfileQuery,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useAddAddressMutation,
  useRemoveAddressMutation,
} = customerApi;