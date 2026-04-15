import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  Download,
  Eye,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  IndianRupee,
  Newspaper,
} from "lucide-react";
import { cancelBooking, getAllBookings } from "../../Api/booking";
import StatCard from "./ui/BookingStateCard";
import BookingModel from "./ui/BookingModel";
import BookingDetailsModal from "./ui/BookingModel";
import CancelBookingModal from "./ui/CancelModel";

// ✅ REAL API IMPORTS

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    shift: "all",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

//! fetching the bookings from backend
  const loadBookings = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const data = await getAllBookings();
     

      const list = Array.isArray(data) ? data : data?.bookings || [];

      setBookings(list);
     

    
      const newStats = list.reduce(
        (acc, booking) => {
          acc.total++;
          const st = (booking?.status || "").toLowerCase();
          if (st === "active") acc.active++;
          else if (st === "pending") acc.pending++;
          else if (st === "completed") acc.completed++;
          else if (st === "cancelled") acc.cancelled++;

          return acc;
        },
        { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0 },
      );

      setStats(newStats);
      console.log(newStats)
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load bookings";
      setError(msg);
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // ---------------- BADGES ----------------
  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();

    const styles = {
      active: "bg-green-100 text-green-800 border border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      completed: "bg-amber-100 text-amber-800 border border-amber-300",
      cancelled: "bg-red-100 text-red-800 border border-red-300",
    };

    const icons = {
      active: Check,
      pending: Clock,
      completed: Check,
      cancelled: X,
    };

    const Icon = icons[s] || Clock;

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[s] || "bg-gray-100 text-gray-800 border border-gray-300"
        } flex items-center gap-1 w-fit`}
      >
        <Icon className="w-3 h-3" />
        {s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown"}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const s = (status || "").toLowerCase();

    const styles = {
      paid: "bg-green-100 text-green-800 border border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      refunded: "bg-blue-100 text-blue-800 border border-blue-300",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          styles[s] || "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
      >
        {s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown"}
      </span>
    );
  };

  //! ---------------- CANCEL BOOKING (REAL API) ----------------
  const handleCancelBooking = async (bookingId) => {
    try {
      setError("");
      setSuccess("");

      await cancelBooking(bookingId);

      setShowCancelModal(false);
      setSelectedBooking(null);

      setSuccess("Booking cancelled successfully ✅");
      setTimeout(() => setSuccess(""), 2500);

      loadBookings();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to cancel booking";
      setError(msg);
      console.error("Failed to cancel booking:", err);
      setTimeout(() => setError(""), 3000);
    }
  };


  // ---------------- FILTERING (Frontend) ----------------
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingId = String(booking?.bookingId || booking?.id || "");
      const userName = String(booking?.userName || booking?.user?.name || "");
      const seat = String(booking?.seat || booking?.seat_number || "");

      const matchesSearch =
        userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        bookingId.toLowerCase().includes(filters.search.toLowerCase()) ||
        seat.toLowerCase().includes(filters.search.toLowerCase());

      const status = String(booking?.status || "").toLowerCase();
      const matchesStatus =
        filters.status === "all" || status === filters.status;

      const shift = String(booking?.shift || "").toLowerCase();
      const matchesShift =
        filters.shift === "all" ||
        shift === String(filters.shift || "").toLowerCase();

      const dateValue = booking?.date ? String(booking.date).slice(0, 10) : "";
      const matchesDate = !filters.date || dateValue === filters.date;

      return matchesSearch && matchesStatus && matchesShift && matchesDate;
    });
  }, [bookings, filters]);

  console.log(filteredBookings)
  // ---------------- PAGINATION (Simple Frontend) ----------------
  const pageSize = 10;
  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage]);


  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">
              Bookings Management
            </h1>
            <p className="text-amber-700 mt-1">
              Manage all seat bookings and reservations
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadBookings}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-semibold shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => alert("CSV export soon 😄")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-semibold shadow-md"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl font-semibold">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl font-semibold">
            ✅ {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            label="Total Bookings"
            value={stats.total}
            color="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 border-amber-300"
            icon={Calendar}
          />
          <StatCard
            label="Active"
            value={stats.active}
            color="bg-gradient-to-br from-green-100 to-emerald-100 text-green-900 border-green-300"
            icon={Check}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-900 border-yellow-300"
            icon={Clock}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-900 border-blue-300"
            icon={Check}
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            color="bg-gradient-to-br from-red-100 to-pink-100 text-red-900 border-red-300"
            icon={X}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Search by name, ID, seat..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.shift}
              onChange={(e) =>
                setFilters({ ...filters, shift: e.target.value })
              }
              className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            >
              <option value="all">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 font-medium text-amber-900"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-800 font-semibold">
                Loading bookings...
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300">
                    <tr>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Booking ID
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        User Details
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Seat
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Shift
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Date
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Amount
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Payment
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-amber-900">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedBookings.map((booking) => {
                      const bookingId =
                        booking.booking_id || booking.id || "N/A";

                      const userName =
                        booking?.userName || booking?.user?.name || "Unknown";
                      const userEmail =
                        booking?.userEmail || booking?.user?.email || "-";

                      const seat = booking?.seat.seat_number || booking?.seat?.seat_number || "-";
                      const seatFloor =
                        booking?.seatFloor || booking?.seat?.floor || "-";

                      const shift = booking?.shift?.name || "-";
                      const shiftTime = booking?.shift?.start_time || "-";

                      const dateStr = booking?.booking_date
                        ? new Date(booking.booking_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "";

                      const amount = booking?.seat?.amount || booking?.price || 0;

                      const status = booking?.status || "pending";
                      const paymentStatus =
                        booking?.payment?.status ||
                        booking?.payment_status ||
                        "bakaya";

                      return (
                        <tr
                          key={booking?.id || bookingId}
                          className="border-b border-amber-100 hover:bg-amber-50 transition"
                        >
                          <td className="py-4 px-4">
                            <span className="font-bold text-amber-900">
                              {bookingId}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {String(userName).charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-amber-900 text-sm">
                                  {userName}
                                </p>
                                <p className="text-xs text-amber-700">
                                  {userEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-amber-900">
                                {seat}
                              </p>
                              <p className="text-xs text-amber-700">
                                {seatFloor}
                              </p>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-amber-900">
                                {shift}
                              </p>
                              <p className="text-xs text-amber-700">
                                {shiftTime}
                              </p>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-sm font-medium text-amber-900">
                            {dateStr}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {amount}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            {getStatusBadge(status)}
                          </td>

                          <td className="py-4 px-4">
                            {getPaymentBadge(paymentStatus)}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowDetailsModal(true);
                                }}
                                className="p-2 hover:bg-amber-100 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-amber-700" />
                              </button>

                              {String(status).toLowerCase() === "active" && (
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowCancelModal(true);
                                  }}
                                  className="p-2 hover:bg-red-100 rounded-lg transition"
                                  title="Cancel Booking"
                                >
                                  <X className="w-4 h-4 text-red-700" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-amber-50 border-t-2 border-amber-200 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-amber-800 font-medium">
                  Showing {paginatedBookings.length} of{" "}
                  {filteredBookings.length} bookings
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border-2 border-amber-300 rounded-lg hover:bg-amber-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-700" />
                  </button>

                  <span className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold text-sm">
                    {currentPage}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border-2 border-amber-300 rounded-lg hover:bg-amber-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-amber-700" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Details Modal */}

        {showDetailsModal && selectedBooking && (
          <BookingDetailsModal
            showDetailsModal={showDetailsModal}
            selectedBooking={selectedBooking}
            setShowDetailsModal={setShowDetailsModal}
            setShowCancelModal={setShowCancelModal}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
          />
        )}

        {/* Cancel Modal */}
        {showCancelModal && selectedBooking && (
          <CancelBookingModal
            showCancelModal={showCancelModal}
            selectedBooking={selectedBooking}
            setShowCancelModal={setShowCancelModal}
            handleCancelBooking={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
