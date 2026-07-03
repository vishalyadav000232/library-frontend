export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://library-backend-k120.onrender.com/api/v1"
).replace(/\/$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const WS_BASE_URL = (
  import.meta.env.VITE_WS_BASE_URL ||
  API_BASE_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:")
).replace(/\/$/, "");


