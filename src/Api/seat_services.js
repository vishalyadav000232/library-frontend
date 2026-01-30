import authApi from "./Api";

// -----------------------------
//! GET ALL SEATS
// -----------------------------
export const getAllSeats = async () => {
  try {
    const res = await authApi.get("/seats");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch seats:", error);
    throw error;
  }
};

// -----------------------------
//! CREATE SEAT (ADMIN)
// -----------------------------
export const createSeat = async (seatData) => {
  try {
    const res = await authApi.post("/seats", seatData);
    return res.data;
  } catch (error) {
    console.error("Failed to create seat:", error);
    throw error;
  }
};


// ! DELETE SEAT (ADMIN)

export const deleteSeat = async (seatId) => {
  try {
    const res = await authApi.delete(`/seats/${seatId}/delete`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete seat:", error);
    throw error;
  }
};


// ! UPDATE SEAR (ADMIN)


export const updateSeat = async (seatId, updateData) => {
  try {
    const res = await authApi.patch(
      `/seats/${seatId}/update`,
      updateData   
    );
    return res.data;
  } catch (error) {
    console.error("Failed to update seat:", error);
    throw error;
  }
};
