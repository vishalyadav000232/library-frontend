
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "./config";
import { getApiErrorMessage } from "./errorHandler";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

let isRefreshing = false;
let refreshPromise = null;

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/signup",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const shouldSkipAuthHeader = (url = "") => {
  return AUTH_ROUTES.some((route) => url.includes(route));
};

const forceLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const requestUrl = config.url || "";

    if (token && !shouldSkipAuthHeader(requestUrl)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";
    const isRefreshCall = requestUrl.includes("/auth/refresh");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          refreshPromise = authApi
            .post("/auth/refresh", {}, { skipToast: true })
            .then((res) => {
              const newAccessToken = res.data?.access_token;

              if (!newAccessToken) {
                throw new Error("Access token not found in refresh response");
              }

              localStorage.setItem("access_token", newAccessToken);
              return newAccessToken;
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        forceLogout();
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    const message = getApiErrorMessage(error);

    if (!originalRequest.skipToast) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default authApi;

