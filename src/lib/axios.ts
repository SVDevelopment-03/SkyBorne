import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setAccessToken,
} from "./token";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const PUBLIC_ROUTES = [
  "/",
  "/about-us",
  "/our-services",
  "/contact-us",
  "/blogs",
  "/faq",
  "/terms",
  "/privacy-policy",
  "/cookie-policy",
  "/how-works",
  "/inner-blog",
  "/packages",
  "/testimonials",
  "/product",
  "/cart",
  "/yoga-detail",
  "/zumba-detail",
  "/diet-detail",
  "/fitness-detail",
];

const PUBLIC_ROUTE_PREFIXES = [
  "/yoga-detail/",
  "/zumba-detail/",
  "/diet-detail/",
  "/fitness-detail/",
  "/product/",
];

const buildLoginUrl = () => {
  if (typeof window === "undefined") return "/login";
  const pathname = window.location.pathname;
  const search = window.location.search;
  const next = `${pathname}${search}`;
  return `/login?next=${encodeURIComponent(next)}`;
};

const isPublicRoute = (pathname: string) =>
  PUBLIC_ROUTES.includes(pathname) ||
  PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      // headers may be a plain object in some environments
      // use bracket notation to avoid relying on a Headers-like API
      (config.headers as Record<string, unknown>)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const requestUrl = String(originalRequest?.url || "");
    const isAuthRequest =
      requestUrl.includes("/login") ||
      requestUrl.includes("/signup") ||
      requestUrl.includes("/social-login") ||
      requestUrl.includes("/send-otp") ||
      requestUrl.includes("/verify-otp") ||
      requestUrl.includes("/request-password-reset") ||
      requestUrl.includes("/forgot-password") ||
      requestUrl.includes("/reset-password");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      try {
        if (!refreshToken) {
          removeTokens();
          if (typeof window !== "undefined") {
            const pathname = window.location.pathname;
            if (pathname !== "/login" && !isPublicRoute(pathname)) {
              window.location.href = buildLoginUrl();
            }
          }
          return Promise.reject(error);
        }

        const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")}/refresh-token`;
        const refresh = await axios.post(
          refreshUrl,
          { refreshToken: refreshToken },
          { withCredentials: true }
        );

        const newToken = (refresh.data as { accessToken: string }).accessToken;

        setAccessToken(newToken);

        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as Record<string, unknown>)["Authorization"] = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        removeTokens();
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (pathname !== "/login" && !isPublicRoute(pathname)) {
            window.location.href = buildLoginUrl();
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
