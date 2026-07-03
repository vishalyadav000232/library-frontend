import authApi from "./Api";
import { notifySuccess } from "./errorHandler";

export const createBooking = async (payload) => {
  const cleanPayload = { ...payload };
  delete cleanPayload.user_id; // backend gets user from JWT token

  const res = await authApi.post("/bookings/", cleanPayload);
  notifySuccess("Booking created successfully");
  return res.data;
};

export const createBookingWithPayment = async (payload) => {
  const cleanPayload = { ...payload };
  delete cleanPayload.user_id;

  const res = await authApi.post("/bookings/create-with-payment", cleanPayload);
  return res.data;
};

export const verifyBookingPayment = async (payload) => {
  const res = await authApi.post("/bookings/verify-payment", payload);
  notifySuccess("Payment verified successfully");
  return res.data;
};

export const getAllBookings = async () => {
  const res = await authApi.get("/admin/bookings/");
  return res.data;
};

export const getBookingById = async (bookingId) => {
  const res = await authApi.get(`/bookings/${bookingId}`);
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await authApi.patch(`/bookings/${bookingId}/cancel`);
  notifySuccess("Booking cancelled successfully");
  return res.data;
};

export const adminCancelBooking = async (bookingId) => {
  const res = await authApi.patch(`/admin/bookings/${bookingId}/cancel`);
  notifySuccess("Booking cancelled successfully");
  return res.data;
};

export const getBookingReport = async () => {
  const res = await authApi.get("/admin/bookings/report");
  return res.data;
};

export const getMyBookings = async () => {
  const res = await authApi.get("/bookings/me");
  return res.data;
};
