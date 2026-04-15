import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Armchair,
  Calendar,
  Users,
  CreditCard,
  Clock,
  FileText,
  Settings,
  BookOpen,
  X,
} from "lucide-react";

const SideBar = ({ showMobileMenu, setShowMobileMenu }) => {
 const menuItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/seats", icon: Armchair, label: "Seats Management" },
  { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/payments", icon: CreditCard, label: "Payments" },
  { path: "/admin/shifts", icon: Clock, label: "Shifts" },
  { path: "/admin/reports", icon: FileText, label: "Reports" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];


  return (
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
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg scale-105"
                  : "text-amber-100 hover:bg-amber-800 hover:text-white"
              }`
            }
            onClick={() => setShowMobileMenu(false)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
