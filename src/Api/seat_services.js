import authApi from "./Api";
import { notifySuccess } from "./errorHandler";

export const getAllSeats = async () => {
  const res = await authApi.get("/seats/");
  return res.data;
};

export const getSeatById = async (seatId) => {
  const res = await authApi.get(`/seats/${seatId}`);
  return res.data;
};

export const getSeatStats = async () => {
  const res = await authApi.get("/admin/seats/stats/summary");
  return res.data;
};

export const createSeat = async (seatData) => {
  const res = await authApi.post("/admin/seats/", seatData);
  notifySuccess("Seat created successfully");
  return res.data;
};

export const deleteSeat = async (seatId) => {
  const res = await authApi.delete(`/admin/seats/${seatId}`);
  notifySuccess("Seat deleted successfully");
  return res.data;
};

export const updateSeat = async (seatId, updateData) => {
  const res = await authApi.patch(`/admin/seats/${seatId}`, updateData);
  notifySuccess("Seat updated successfully");
  return res.data;
};
