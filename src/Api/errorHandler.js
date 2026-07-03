import toast from "react-hot-toast";

const STATUS_MESSAGES = {
  400: "Bad request. Please check your input.",
  401: "Session expired. Please login again.",
  403: "You do not have permission to perform this action.",
  404: "Requested resource was not found.",
  409: "This record already exists or conflicts with existing data.",
  422: "Validation failed. Please check the form fields.",
  429: "Too many requests. Please try again later.",
  500: "Internal server error. Please try again later.",
  502: "Server gateway error. Please try again later.",
  503: "Server is temporarily unavailable.",
};

const extractFastApiValidationMessage = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return errors
    .map((err) => {
      const field = Array.isArray(err.loc) ? err.loc.filter((x) => x !== "body").join(".") : "field";
      return field ? `${field}: ${err.msg}` : err.msg;
    })
    .join(" | ");
};

export const getApiErrorMessage = (error) => {
  if (!error) return "Something went wrong.";

  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Unable to connect to server. Please check backend/CORS/network.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (typeof data === "string") return data;

  if (data?.message) return data.message;

  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    const msg = extractFastApiValidationMessage(data.detail);
    if (msg) return msg;
  }

  if (Array.isArray(data?.errors)) {
    const msg = extractFastApiValidationMessage(data.errors);
    if (msg) return msg;
  }

  if (data?.error_code && STATUS_MESSAGES[status]) {
    return `${STATUS_MESSAGES[status]} (${data.error_code})`;
  }

  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];

  return error.message || "Something went wrong.";
};

export const notifyApiError = (error, fallback) => {
  const message = fallback || getApiErrorMessage(error);
  toast.error(message);
  return message;
};

export const notifySuccess = (message) => {
  if (message) toast.success(message);
};
