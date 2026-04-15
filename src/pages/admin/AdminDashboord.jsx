import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Armchair,
  Calendar,
  Users,
  CreditCard,
  Clock,
  FileText,
  Settings,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  MapPin,
  Phone,
  X,
} from "lucide-react";

import BookingsPage from "./BookingManagment";
import SeatManagement from "./SeatManagment";
import AdminUserManagement from "./AdminUserManagment";
import StatCard from "./ui/StatCard";
import Header from "./ui/Header";

import { getDashboardData } from "../../Api/admin";
import { get_all_users } from "../../Api/usrs";

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState([]);
  const [dashboard, setDashboard] = useState({
    total_seats: 0,
    available_seats: 0,
    total_bookings: 0,
    monthly_revenue: 0,
  });

  // ✅ Load all real data (Dashboard + Users)
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const [dashboardData, users] = await Promise.all([
          getDashboardData(),
          get_all_users(),
        ]);

        setDashboard(dashboardData || {});
        setUser(users || []);
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);



  // Close mobile menu when changing pages
  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    setShowMobileMenu(false);
  };

  // TODO: Add handler functions for user actions
  const handleViewUser = (userId) => {
    console.log("View user:", userId);
  };

  const handleEditUser = (userId) => {
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // 🔥 Delete API yaha add karna hoga
        // await deleteUser(userId);

        // Refresh users list
        const users = await get_all_users();
        setUser(users || []);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleAddSeat = () => {
    console.log("Add new seat");
  };

  const handleManageShifts = () => {
    console.log("Manage shifts");
    setCurrentPage("shifts");
  };

  const handleExportReports = () => {
    console.log("Export reports");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-semibold text-sm sm:text-base">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-amber-900 to-amber-800 text-white border-r-2 border-amber-700 overflow-y-auto shadow-2xl z-50 transition-transform duration-300 ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-amber-700 bg-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">LibraryOS</h1>
              <p className="text-xs text-amber-300">Admin Panel</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setShowMobileMenu(false)}
            className="lg:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                currentPage === item.id
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg scale-105"
                  : "text-amber-100 hover:bg-amber-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header showDropdown={showDropdown} />

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          {currentPage === "dashboard" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
                  Dashboard
                </h1>
                <p className="text-amber-700 mt-1 text-sm sm:text-lg">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Total Seats"
                  value={dashboard?.total_seats ?? 0}
                  icon={Armchair}
                  gradient="bg-gradient-to-br from-amber-600 to-orange-600"
                />
                <StatCard
                  title="Available Seats"
                  value={dashboard?.available_seats ?? 0}
                  icon={Armchair}
                  gradient="bg-gradient-to-br from-green-600 to-emerald-600"
                />
                <StatCard
                  title="Active Bookings"
                  value={dashboard?.total_bookings ?? 0}
                  icon={Calendar}
                  gradient="bg-gradient-to-br from-orange-600 to-red-600"
                />
                <StatCard
                  title="Monthly Revenue"
                  value={`₹${(dashboard?.monthly_revenue ?? 0).toLocaleString()}`}
                  icon={IndianRupee}
                  gradient="bg-gradient-to-br from-amber-700 to-amber-600"
                />
              </div>

              {/* Charts Section (still static for now) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-4">
                    Weekly Bookings
                  </h3>

                  <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, i) => {
                        const height = [45, 52, 48, 61, 55, 67, 43][i];
                        return (
                          <div
                            key={day}
                            className="flex-1 flex flex-col items-center gap-2"
                          >
                            <div
                              className="w-full bg-gradient-to-t from-amber-600 to-orange-500 rounded-t-lg hover:from-amber-700 hover:to-orange-600 transition-all cursor-pointer shadow-md"
                              style={{ height: `${(height / 67) * 100}%` }}
                              title={`${height} bookings`}
                            ></div>
                            <span className="text-xs text-amber-800 font-semibold">
                              {day.slice(0, 1)}
                              <span className="hidden sm:inline">
                                {day.slice(1)}
                              </span>
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-4">
                    Revenue Trend (6 Months)
                  </h3>

                  <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-3">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                      (month, i) => {
                        const revenue = [
                          45000, 52000, 48000, 61000, 55000, 67000,
                        ][i];
                        return (
                          <div
                            key={month}
                            className="flex-1 flex flex-col items-center gap-2"
                          >
                            <div
                              className="w-full bg-gradient-to-t from-green-600 to-emerald-500 rounded-t-lg hover:from-green-700 hover:to-emerald-600 transition-all cursor-pointer shadow-md"
                              style={{ height: `${(revenue / 67000) * 100}%` }}
                              title={`₹${revenue.toLocaleString()}`}
                            ></div>
                            <span className="text-xs text-amber-800 font-semibold">
                              {month}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Users Table (Real users) */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900">
                    Recent Users
                  </h3>
                  <button
                    onClick={() => handlePageChange("users")}
                    className="text-amber-700 hover:text-amber-800 text-xs sm:text-sm font-bold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-amber-200 bg-amber-50">
                          <th className="text-left py-3 px-4 text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap">
                            User
                          </th>
                          <th className="text-left py-3 px-4 text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap hidden sm:table-cell">
                            Seat
                          </th>
                          <th className="text-left py-3 px-4 text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {user.slice(0, 5).map((u) => (
                          <tr
                            key={u.id}
                            className="border-b border-amber-100 hover:bg-amber-50 transition"
                          >
                            <td className="py-3 px-4 text-xs sm:text-sm font-semibold text-amber-900">
                              {u.name}
                            </td>

                            <td className="py-3 px-4 text-xs sm:text-sm text-amber-800 font-medium hidden sm:table-cell">
                              --
                            </td>

                            <td className="py-3 px-4 text-xs sm:text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  u.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {u.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleViewUser(u.id)}
                                  className="p-1.5 hover:bg-amber-100 rounded-lg transition"
                                  title="View"
                                >
                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-amber-700" />
                                </button>

                                <button
                                  onClick={() => handleEditUser(u.id)}
                                  className="p-1.5 hover:bg-amber-100 rounded-lg transition"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-orange-700" />
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 hover:bg-red-100 rounded-lg transition"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-700" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {user.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-6 text-center text-amber-700 font-semibold"
                            >
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:scale-105 transition-all border-2 border-amber-700">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 mb-3" />
                  <h4 className="font-bold text-base sm:text-lg mb-2">
                    Add New Seat
                  </h4>
                  <p className="text-amber-100 text-xs sm:text-sm mb-4">
                    Create and configure new library seats
                  </p>
                  <button
                    onClick={handleAddSeat}
                    className="bg-white text-amber-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-50 transition text-xs sm:text-sm font-bold shadow-md"
                  >
                    Add Seat
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:scale-105 transition-all border-2 border-orange-700">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-3" />
                  <h4 className="font-bold text-base sm:text-lg mb-2">
                    Manage Shifts
                  </h4>
                  <p className="text-orange-100 text-xs sm:text-sm mb-4">
                    Configure shift timings and pricing
                  </p>
                  <button
                    onClick={handleManageShifts}
                    className="bg-white text-orange-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-50 transition text-xs sm:text-sm font-bold shadow-md"
                  >
                    Configure
                  </button>
                </div>

                <div className="bg-gradient-to-br from-amber-700 to-amber-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:scale-105 transition-all border-2 border-amber-800 sm:col-span-2 lg:col-span-1">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 mb-3" />
                  <h4 className="font-bold text-base sm:text-lg mb-2">
                    Export Reports
                  </h4>
                  <p className="text-amber-100 text-xs sm:text-sm mb-4">
                    Download detailed analytics and reports
                  </p>
                  <button
                    onClick={handleExportReports}
                    className="bg-white text-amber-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-50 transition text-xs sm:text-sm font-bold shadow-md"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-amber-200 hover:scale-105 transition-all">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">
                    Location
                  </h4>
                  <p className="text-sm sm:text-base text-amber-700 font-medium">
                    123 Library Street, Lucknow, UP
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-amber-200 hover:scale-105 transition-all">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">
                    Hours
                  </h4>
                  <p className="text-sm sm:text-base text-amber-700 font-medium">
                    Mon - Sun: 6:00 AM - 11:00 PM
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-amber-200 hover:scale-105 transition-all sm:col-span-2 lg:col-span-1">
                  <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mb-4" />
                  <h4 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">
                    Contact
                  </h4>
                  <p className="text-sm sm:text-base text-amber-700 font-medium">
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentPage === "bookings" ? <BookingsPage /> : null}
          {currentPage === "seats" ? <SeatManagement /> : null}
          {currentPage === "users" ? <AdminUserManagement /> : null}

          {/* Other pages placeholder */}
          {currentPage !== "dashboard" &&
            currentPage !== "bookings" &&
            currentPage !== "seats" &&
            currentPage !== "users" && (
              <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
                    {menuItems.find((m) => m.id === currentPage)?.icon &&
                      React.createElement(
                        menuItems.find((m) => m.id === currentPage).icon,
                        { className: "w-8 h-8 text-amber-700" }
                      )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">
                    {menuItems.find((m) => m.id === currentPage)?.label}
                  </h3>
                  <p className="text-sm sm:text-base text-amber-700 font-medium mb-4">
                    This page is under construction. Click Dashboard to return.
                  </p>
                  <button
                    onClick={() => handlePageChange("dashboard")}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
