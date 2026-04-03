import { useState } from "react";
import API from "@/lib/axios";

export function useApi() {
  const [loading, setLoading] = useState(false);

  const request = async <TResponse, TBody = unknown>(
    method: string,
    url: string,
    data?: TBody
  ): Promise<TResponse> => {
    setLoading(true);
    try {
      const res = await API({ method, url, data });
      return res.data as TResponse;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      throw error.response?.data || "API error";
    } finally {
      setLoading(false);
    }
  };

  return { request, loading };
}
