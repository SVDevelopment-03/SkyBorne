import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import API from "@/lib/axios";

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await API({ url, method, data, params });
      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError;

      // These two are ALWAYS safe and never crash:
      const status = err.response?.status;
      const responseData = err.response?.data;

      return {
        error: {
          status: status || 500,
          data: responseData || err.message || "Something went wrong",
        },
      };
    }
  };
