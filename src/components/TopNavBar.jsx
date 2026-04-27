import React, { useState } from "react";
import {
  BookOpen,
  Home,
  Calendar,
  Armchair,
  User,
  ClipboardClock,
  Bell,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const TopNavBar = () => {
  const [open, setOpen] = useState(false);

  
  const [notifications] = useState([
    { id: 1, message: "Seat A1 booked", time: "2 sec ago" },
    { id: 2, message: "New user registered", time: "1 min ago" },
    { id: 3, message: "Payment successful", time: "3 min ago" },
  ]);

  const navData = [
    { name: "Home", path: "/dashboard/home", icon: Home },
    { name: "Bookings", path: "/dashboard/bookings", icon: Calendar },
    { name: "My Bookings", path: "/dashboard/my-bookings", icon: ClipboardClock },
    { name: "Profile", path: "/dashboard/profile", icon: User, isProfile: true },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">

          {/* 🔹 Mobile: Logo */}
          <div className="flex items-center gap-4 md:hidden">
            <div className="bg-amber-100 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-amber-800" />
            </div>
            <h1 className="text-lg font-bold text-amber-900">
              Yadav Library
            </h1>
          </div>

          {/* 🔹 Desktop Logo */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-xl">
              <BookOpen className="h-7 w-7 text-amber-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-900">
                Yadav Library
              </h1>
              <p className="text-xs text-amber-600">
                Your Reading Haven
              </p>
            </div>
          </div>

          {/* 🔹 Desktop Nav + Notification */}
          <div className="hidden md:flex items-center gap-6">

            {/* Nav Links */}
            {navData.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition
                    ${
                      item.isProfile
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-2 hover:scale-105"
                        : isActive
                        ? "text-amber-800 bg-amber-100"
                        : "text-gray-700 hover:text-amber-800 hover:bg-amber-50"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}

            {/* 🔔 Notification */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-amber-100 transition"
              >
                <Bell className="w-6 h-6 text-amber-700" />

                {/* Badge */}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-amber-200 rounded-xl shadow-xl z-50">

                  {/* Header */}
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h3 className="font-semibold text-amber-900">
                      Notifications
                    </h3>
                    <button onClick={() => setOpen(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 hover:bg-amber-50 transition border-b last:border-none"
                        >
                          <p className="text-sm text-amber-900">{n.message}</p>
                          <span className="text-xs text-gray-500">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="text-center py-2 text-sm text-amber-600 cursor-pointer hover:bg-amber-50">
                    View All
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;