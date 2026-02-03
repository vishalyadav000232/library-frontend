import authApi from "./Api";

// -----------------------------
//! GET ALL shift
// -----------------------------
export const getAllShift = async () => {
  try {
    const res = await authApi.get("/shift");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch seats:", error);
    throw error;
  }
};