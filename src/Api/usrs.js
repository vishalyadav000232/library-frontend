import authApi from "./Api";
import { notifySuccess } from "./errorHandler";

export const get_all_users = async (params = {}) => {
  const res = await authApi.get("/admin/user/", { params });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await authApi.get("/auth/me");
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await authApi.get(`/admin/user/${userId}`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await authApi.delete(`/admin/user/${userId}`);
  notifySuccess("User deleted successfully");
  return res.data;
};
