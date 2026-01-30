import React from "react";
import {
  BookOpen,
  Home,
  Calendar,
  Armchair,
  User,
  ClipboardClock,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const TopNavBar = () => {
  const navData = [
  { name: "Home", path: "/dashboard/home", icon: Home },
  { name: "Seats", path: "/dashboard/seats", icon: Armchair },
  { name: "Bookings", path: "/dashboard/bookings", icon: Calendar },
  { name: "My Bookings", path: "/dashboard/my-bookings", icon: ClipboardClock },
  { name: "Profile", path: "/dashboard/profile", icon: User, isProfile: true },
];

  return (
    <nav className="bg-white/95 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">

          {/* 🔹 Mobile: Only Name */}
          <div className=" flex  justify-center items-center  gap-4 md:hidden text-center w-full">
            <div className="bg-amber-100 p-4 rounded-xl">
              <BookOpen className="h-8 w-8 text-amber-800" />
            </div>
            <h1 className="text-xl font-bold text-amber-900">
              Yadav ji Library
            </h1>
          </div>

          {/* 🔹 Desktop: Logo + Name */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-amber-100 p-4 rounded-xl">
              <BookOpen className="h-8 w-8 text-amber-800" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">
                Yadav ji Library
              </h1>
              <p className="text-sm text-amber-600">
                Your Reading Haven
              </p>
            </div>
          </div>

          {/* 🔹 Desktop Nav Links Only */}
          <div className="hidden md:flex gap-6">
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
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 hover:scale-105"
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
          </div>

        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
