/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import API from "@/lib/axios";

export function useApi() {
  const [loading, setLoading] = useState(false);

  const request = async (method: string, url: string, data?: any) => {
    setLoading(true);
    try {
      const res = await API({ method, url, data });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || "API error";
    } finally {
      setLoading(false);
    }
  };

  return { request, loading };
}
