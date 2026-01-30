import authApi from "./Api";



export const get_all_users = async () => {
  try {
    const res = await authApi.get("/users");
    return res.data;
  } catch (error) {
    console.error("Get users failed:", error);
    throw error;
  }
};
