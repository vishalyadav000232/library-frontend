import authApi from "./Api";

// -----------------------------
//! GET ALL shift
// -----------------------------
export const getAllShift = async () => {
  try {
    const res = await authApi.get("/shifts");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch seats:", error);
    throw error;
  }
};