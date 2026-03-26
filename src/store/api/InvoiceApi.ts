// store/api/invoiceApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

interface InvoiceDetails {
  invoiceId: string;
  orderRef: string;
  transactionId?: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  billingType: string;
  date: string;
  subscriptionEndDate: string;
  taxRate?: number;
  subtotal?: number;
  vatAmount?: number;
  total?: number;
  taxLabel?: string;
}

interface InvoiceDetailsResponse {
  success: boolean;
  invoice: InvoiceDetails;
}

interface UserInvoicesResponse {
  success: boolean;
  invoices: Array<{
    invoiceId: string;
    orderRef: string;
    amount: number;
    currency: string;
    plan: string;
    status: string;
    paymentMethod: string;
    billingType: string;
    date: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface InvoiceDownloadParams {
  invoiceId: string;
  transactionId?: string;
  orderRef?: string;
}

interface UserInvoicesParams {
  userId: string;
  limit?: number;
  page?: number;
}

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Invoice"],

  endpoints: (builder) => ({
    // =======================================
    // GET INVOICE DETAILS (METADATA)
    // =======================================
    getInvoiceDetails: builder.query<InvoiceDetailsResponse, InvoiceDownloadParams>({
      query: ({ invoiceId }) => ({
        url: `/invoice/${invoiceId}/details`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    // =======================================
    // DOWNLOAD INVOICE PDF
    // =======================================
    downloadInvoicePDF: builder.mutation<Blob, InvoiceDownloadParams>({
      query: ({ invoiceId, transactionId, orderRef }) => {
        const params: Record<string, string> = {
          invoiceId,
        };
        if (transactionId) {
          params.transactionId = transactionId;
          params.transaction_id = transactionId;
          params.txnId = transactionId;
          params.reference = transactionId;
          params.paymentReference = transactionId;
          params.payment_reference = transactionId;
        }
        if (orderRef) {
          params.orderRef = orderRef;
          params.order_ref = orderRef;
        }

        return {
          url: `/invoice/${invoiceId}/download`,
          method: "GET",
          params,
          headers: {
            "x-invoice-id": invoiceId,
            ...(transactionId ? { "x-transaction-id": transactionId } : {}),
            ...(orderRef ? { "x-order-ref": orderRef } : {}),
          },
          responseType: "blob",
        };
      },
    }),

    // =======================================
    // GET ALL USER INVOICES
    // =======================================
    getUserInvoices: builder.query<UserInvoicesResponse, UserInvoicesParams>({
      query: ({ userId, limit = 10, page = 1 }) => ({
        url: `/invoices/user/${userId}`,
        method: "GET",
        params: { limit, page },
      }),
      providesTags: ["Invoice"],
    }),
  }),
});

export const {
  useGetInvoiceDetailsQuery,
  useDownloadInvoicePDFMutation,
  useGetUserInvoicesQuery,
} = invoiceApi;
