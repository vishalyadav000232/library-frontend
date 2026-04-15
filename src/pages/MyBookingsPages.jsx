import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Filter,
  Armchair,
} from "lucide-react";
import { getCurrentUser } from "../Api/usrs";
import { cancelBooking, getMyBookings } from "../Api/booking";


export default function MyBookingsPage() {
  // ---------------- STATE ----------------
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ---------------- FETCH CURRENT USER + BOOKINGS ----------------
  useEffect(() => {
    const fetchUserAndBookings = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const data = await getMyBookings(); // Returns bookings for current user
        setBookings(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load user or bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  // ---------------- FILTER BOOKINGS ----------------
  const filteredBookings = bookings.filter((booking) => {
    if (selectedDate && booking.start_date !== selectedDate) return false;
    if (selectedShift !== "all" && booking.shift_id !== selectedShift) return false;
    return true;
  });

  // ---------------- STATS ----------------
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "ACTIVE" || b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED" || b.status === "cancelled").length,
  };

  // ---------------- STATUS CONFIG ----------------
  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE":
      case "confirmed":
        return {
          icon: CheckCircle2,
          bgColor: "bg-green-100",
          borderColor: "border-green-500",
          textColor: "text-green-700",
          iconColor: "text-green-600",
          label: "Confirmed",
        };
      case "pending":
        return {
          icon: AlertCircle,
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-500",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-600",
          label: "Pending",
        };
      case "CANCELLED":
      case "cancelled":
        return {
          icon: XCircle,
          bgColor: "bg-red-100",
          borderColor: "border-red-500",
          textColor: "text-red-700",
          iconColor: "text-red-600",
          label: "Cancelled",
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: "bg-gray-100",
          borderColor: "border-gray-500",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
          label: "Unknown",
        };
    }
  };

  // ---------------- HANDLERS ----------------
  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Cancel booking for Seat ${booking.seat_id}?`)) return;

    try {
      await cancelBooking(booking.id);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      alert("Booking cancelled successfully!");
    } catch (err) {
      alert("Failed to cancel booking");
      console.error(err);
    }
  };

  const handleViewDetails = (booking) => {
    alert(`Viewing details for Seat ${booking.seat_id}`);
  };

  const handleBookAgain = (booking) => {
    alert(`Rebooking Seat ${booking.seat_id}`);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Armchair className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">
                  My Bookings
                </h1>
                {currentUser && (
                  <p className="text-sm text-amber-700">
                    Hello, {currentUser.name}! You have {stats.total} booking
                    {stats.total !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 bg-amber-100 rounded-lg text-amber-800"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4`}
          >
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Filter by Shift
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none"
              >
                <option value="all">All Shifts</option>
                {[...new Set(bookings.map((booking) => booking.shift_id))].map((shiftId) => (
                  <option key={shiftId} value={shiftId}>
                    {shiftId.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-amber-500">
            <p className="text-sm text-amber-700 font-medium">Total</p>
            <p className="text-2xl font-bold text-amber-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-sm text-green-700 font-medium">Confirmed</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
            <p className="text-sm text-yellow-700 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500">
            <p className="text-sm text-red-700 font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-900">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <p className="text-center text-amber-700">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <Armchair className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              No Bookings Found
            </h2>
            <p className="text-amber-700 mb-6">
              You haven't made any seat reservations yet.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/bookings")}
              className="bg-linear-to-r from-amber-600 to-orange-600 text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition shadow-lg"
            >
              Book a Seat Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 border-amber-100"
                >
                  {/* Card Header */}
                  <div
                    className={`p-4 ${statusConfig.bgColor} border-b-2 ${statusConfig.borderColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg">
                          <Armchair className="w-6 h-6 text-amber-800" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-amber-900">
                            Seat {booking.seat_id?.slice(0, 8) || "N/A"}
                          </h3>
                          <p className="text-sm text-amber-700">
                            Shift: {booking.shift_id?.slice(0, 8) || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
                      >
                        <StatusIcon
                          className={`w-4 h-4 ${statusConfig.iconColor}`}
                        />
                        <span
                          className={`text-xs font-semibold ${statusConfig.textColor}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700 font-medium">Date:</span>
                        <span className="text-amber-900 font-semibold">
                          {new Date(booking.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700 font-medium">Shift:</span>
                        <span className="text-amber-900 font-semibold">
                          {booking.shift_name || booking.shift_id}
                        </span>
                      </div>
                      {booking.shift_time && (
                        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          {booking.shift_time}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition shadow-md text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>

                      {booking.status === "cancelled" ? (
                        <button
                          onClick={() => handleBookAgain(booking)}
                          className="flex-1 flex items-center justify-center gap-2 bg-amber-100 text-amber-900 font-semibold py-2 px-4 rounded-lg hover:bg-amber-200 transition border-2 border-amber-300 text-sm"
                        >
                          Book Again
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition border-2 border-red-200 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-600">
                      Booking date: {new Date(booking.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
