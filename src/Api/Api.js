import axios from "axios"

const authApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
})


// ===============================
// REQUEST INTERCEPTOR
// ===============================
authApi.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("access_token")

    const requestUrl = config.url || "";
    const isAuthRoute =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/signup") ||
      requestUrl.includes("/users/refresh")

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)



authApi.interceptors.response.use(
  (response) => response,

  async (error) => {
  
    const originalRequest = error.config;

    const requestUrl = originalRequest?.url || "";
    const isRefreshCall = requestUrl.includes("/users/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;

      try {
        const res = await authApi.post("/users/refresh",
          {},
          { withCredentials: true }
        );
        console.log(res)

        const newAccess = res.data.access_token;

        if (!newAccess) {
          throw new Error("No access token returned");
        }

        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return authApi(originalRequest);

      } catch (refreshError) {
        console.log("Session expired. Please login again.");

        localStorage.removeItem("access_token");
        // window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi