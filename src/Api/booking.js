import authApi from "./Api";

//! ✅ CREATE BOOKING

export const createBooking = async (payload) => {
  try {
    const res = await authApi.post("/bookings", payload);
    console.log("Booking Success:", res.data);
    return res.data;
  } catch (error) {
    console.error("Booking Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ GET ALL BOOKINGS (Admin)
export const getAllBookings = async () => {
  try {
    const res = await authApi.get("/bookings/all");
    return res.data;
  } catch (error) {
    console.error("Get All Bookings Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ GET BOOKING BY ID
export const getBookingById = async (bookingId) => {
  try {
    const res = await authApi.get(`/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    console.error("Get Booking Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ UPDATE BOOKING (PATCH)
export const updateBooking = async (bookingId, payload) => {
  try {
    const res = await authApi.patch(`/bookings/${bookingId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Update Booking Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ CANCEL BOOKING (PATCH)
export const cancelBooking = async (bookingId) => {
  try {
    const res = await authApi.patch(`/bookings/${bookingId}/cancel`);
    return res.data;
  } catch (error) {
    console.error("Cancel Booking Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ DELETE BOOKING (Admin / Hard Delete)
export const deleteBooking = async (bookingId) => {
  try {
    const res = await authApi.delete(`/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    console.error("Delete Booking Failed:", error.response?.data || error.message);
    throw error;
  }
};

//! ✅ GET MY BOOKINGS (User)
export const getMyBookings = async () => {
  try {
    const res = await authApi.get("/bookings/me/my-bookings");
    return res.data;
  } catch (error) {
    console.error("My Bookings Failed:", error.response?.data || error.message);
    throw error;
  }
};
