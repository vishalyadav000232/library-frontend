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
import SeatModal from "./ui/CreateSeatModel";

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentSeat, setCurrentSeat] = useState(null);

  const [formData, setFormData] = useState({
    seat_number: "",
    is_active: true,
    floor: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //!  Load seats on component mount
  useEffect(() => {
    loadSeats();
  }, []);

  //! Load all seats

  const loadSeats = async () => {
    try {
      setLoading(true);
      const data = await getAllSeats();
      setSeats(data);
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
    setSuccess("");
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (seat) => {
    setModalMode("edit");
    setCurrentSeat(seat);
    setFormData({
      seat_number: seat.seat_number,
      is_active: seat.is_active,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  //! Create / Update seat submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.seat_number.trim()) {
      setError("Seat number is required");
      return;
    }
    if (!formData.floor.trim()) {
      setError("floor number is required");
      return;
    }

    try {
      if (modalMode === "create") {
        const payload = {
          seat_number: formData.seat_number.trim(),
          is_active: formData.is_active,
          floor: formData.floor,
        };
        await createSeat(payload);
        console.log(payload);
        setSuccess("Seat created successfully!");
      } else {
        const payload = {
          seat_number: formData.seat_number.trim(),
          is_active: formData.is_active,
        };

        await updateSeat(currentSeat.id, payload);
        setSuccess("Seat updated successfully!");
      }

      await loadSeats();

      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1200);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || "Operation failed";

      setError(errorMessage);
      console.error(err);
    }
  };

  //! Delete seat

  const handleDelete = async (seat) => {
    if (
      !window.confirm(
        `Are you sure you want to delete seat ${seat.seat_number}?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSeat(seat.id);

      setSuccess(`Seat ${seat.seat_number} deleted successfully!`);
      await loadSeats();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || "Failed to delete seat";

      setError(errorMessage);
      console.error(err);

      setTimeout(() => setError(""), 2500);
    }
  };

  // Toggle active status (REAL API)
  const handleToggleActive = async (seat) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        is_active: !seat.is_active,
      };

      await updateSeat(seat.id, payload);
      await loadSeats();

      setSuccess(
        `Seat ${seat.seat_number} ${
          !seat.is_active ? "activated" : "deactivated"
        } successfully!`,
      );

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to update seat status";

      setError(errorMessage);
      console.error(err);

      setTimeout(() => setError(""), 2500);
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
        <SeatModal
          showModal={showModal}
          setShowModal={setShowModal}
          modalMode={modalMode}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          error={error}
          success={success}
        />
      )}
    </div>
  );
};

export default SeatManagement;
