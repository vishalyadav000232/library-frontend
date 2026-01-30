import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  Armchair,
  AlertCircle,
} from "lucide-react";
import {
  createSeat,
  deleteSeat,
  getAllSeats,
  updateSeat,
} from "../../Api/seat_services";

// TODO: Import your actual API functions
// import { getAllSeats, createSeat, updateSeat, deleteSeat } from "../../Api/seat_services";

// Mock API for demonstration - Replace with your actual API
const seatAPI = {
  // GET ALL SEATS - You already have this: getAllSeats()
  getAllSeats: async () => {
    // Replace with: return await getAllSeats();
    return [
      { id: "1", seat_number: "A-01", is_active: true },
      { id: "2", seat_number: "A-02", is_active: true },
      { id: "3", seat_number: "B-01", is_active: false },
    ];
  },

  // CREATE SEAT - POST /seats
  // Expected payload: { seat_number: "A-01" }
  createSeat: async (seatData) => {
    // Replace with your actual API call
    // const response = await fetch(`${API_BASE_URL}/seats`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(seatData)
    // });
    // return await response.json();

    return {
      id: Math.random().toString(),
      seat_number: seatData.seat_number,
      is_active: true,
    };
  },

  // UPDATE SEAT - PUT /seats/{seat_id}
  // Expected payload: { seat_number: "A-01", is_active: true }
  updateSeat: async (seatId, seatData) => {
    // Replace with your actual API call
    // const response = await fetch(`${API_BASE_URL}/seats/${seatId}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(seatData)
    // });
    // return await response.json();

    return {
      id: seatId,
      ...seatData,
    };
  },

  // DELETE SEAT - DELETE /seats/{seat_id}
  deleteSeat: async (seatId) => {
    // Replace with your actual API call
    // const response = await fetch(`${API_BASE_URL}/seats/${seatId}`, {
    //   method: "DELETE"
    // });
    // return await response.json();

    return { success: true };
  },
};

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentSeat, setCurrentSeat] = useState(null);
  const [formData, setFormData] = useState({
    seat_number: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load seats on component mount
  useEffect(() => {
    loadSeats();
  }, []);

  // ! Seat api

  const loadSeats = async () => {
    try {
      setLoading(true);
      const data = await getAllSeats();
      setSeats(data);
      console.log(data);
    } catch (err) {
      setError("Failed to load seats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating new seat
  const handleCreateNew = () => {
    setModalMode("create");
    setFormData({ seat_number: "", is_active: true });
    setCurrentSeat(null);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (seat) => {
    setModalMode("edit");
    setCurrentSeat(seat);
    setFormData({
      seat_number: seat.seat_number,
      is_active: seat.is_active,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    if (!formData.seat_number.trim()) {
      setError("Seat number is required");
      return;
    }

    try {
      if (modalMode === "create") {
        await createSeat({
          seat_number: formData.seat_number?.trim(),
          is_active: formData.is_active,
        });

        setSuccess("Seat created successfully!");
      } else {
        const payload = {};

        if (formData.seat_number?.trim()) {
          payload.seat_number = formData.seat_number.trim();
        }

        if (typeof formData.is_active === "boolean") {
          payload.is_active = formData.is_active;
        }
        console.log(payload)
        const res = await updateSeat(currentSeat.id, payload);

        console.log("Update response:", res);
        setSuccess("Seat updated successfully!");
      }

      await loadSeats();

      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || "Operation failed";

      setError(errorMessage);
      console.error(err);
    }
  };

  // Handle seat deletion
  const handleDelete = async (seat) => {
    if (
      !window.confirm(
        `Are you sure you want to delete seat ${seat.seat_number}?`,
      )
    ) {
      return;
    }

    try {
      await deleteSeat(seat.id);
      setSuccess(`Seat ${seat.seat_number} deleted successfully!`);
      const res = await loadSeats();
      console.log(res);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete seat");
      console.error(err);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Toggle seat active status
  const handleToggleActive = async (seat) => {
    try {
      // TODO: Replace with your actual updateSeat API call
      // PUT /seats/{seat_id}
      await seatAPI.updateSeat(seat.id, {
        seat_number: seat.seat_number,
        is_active: !seat.is_active,
      });
      await loadSeats();
      setSuccess(
        `Seat ${seat.seat_number} ${
          !seat.is_active ? "activated" : "deactivated"
        }`,
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update seat status");
      console.error(err);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Filter seats based on search query
  const filteredSeats = seats.filter((seat) =>
    seat.seat_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-semibold text-sm sm:text-base">
            Loading seats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
            Seat Management
          </h1>
          <p className="text-amber-700 text-sm sm:text-base">
            Manage library seats - Create, Edit, and Delete
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {error && !showModal && (
          <div className="mb-4 bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Search by seat number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateNew}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Seat
            </button>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSeats.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg border-2 border-amber-200 p-12 text-center">
              <Armchair className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <p className="text-amber-700 font-medium">
                {searchQuery
                  ? "No seats found matching your search"
                  : "No seats available. Create your first seat!"}
              </p>
            </div>
          ) : (
            filteredSeats.map((seat) => (
              <div
                key={seat.id}
                className={`bg-white rounded-xl shadow-lg border-2 p-6 hover:scale-105 transition-all ${
                  seat.is_active
                    ? "border-amber-200 hover:shadow-xl"
                    : "border-gray-300 opacity-75"
                }`}
              >
                {/* Seat Icon and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      seat.is_active
                        ? "bg-gradient-to-br from-amber-600 to-orange-600"
                        : "bg-gray-400"
                    }`}
                  >
                    <Armchair className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      seat.is_active
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                  >
                    {seat.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Seat Number */}
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  {seat.seat_number}
                </h3>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(seat)}
                    className={`flex-1 px-3 py-2 rounded-lg transition font-medium text-sm ${
                      seat.is_active
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        : "bg-green-100 hover:bg-green-200 text-green-800"
                    }`}
                  >
                    {seat.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(seat)}
                    className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-amber-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(seat)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-700" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
            <p className="text-sm text-amber-700 mb-1">Total Seats</p>
            <p className="text-3xl font-bold text-amber-900">{seats.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6">
            <p className="text-sm text-green-700 mb-1">Active Seats</p>
            <p className="text-3xl font-bold text-green-900">
              {seats.filter((s) => s.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <p className="text-sm text-gray-700 mb-1">Inactive Seats</p>
            <p className="text-3xl font-bold text-gray-900">
              {seats.filter((s) => !s.is_active).length}
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-amber-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-amber-200">
              <h2 className="text-xl font-bold text-amber-900">
                {modalMode === "create" ? "Add New Seat" : "Edit Seat"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-amber-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              {/* Seat Number Input */}
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">
                  Seat Number *
                </label>
                <input
                  type="text"
                  value={formData.seat_number}
                  onChange={(e) =>
                    setFormData({ ...formData, seat_number: e.target.value })
                  }
                  placeholder="e.g., A-01, B-12"
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                />
                <p className="text-xs text-amber-600 mt-1">
                  Enter a unique seat identifier
                </p>
              </div>

              {/* Active Status Toggle (only for edit mode) */}
              {modalMode === "edit" && (
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <div>
                    <p className="font-bold text-amber-900">Active Status</p>
                    <p className="text-xs text-amber-600">
                      Enable or disable this seat
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md"
                >
                  {modalMode === "create" ? "Create Seat" : "Update Seat"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatManagement;
