import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getUser } from "../../../Api/admin";
import { useNavigate } from "react-router-dom";

const Header = ({ showDropdown }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


const navigarion = useNavigate();


useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getUser();
      console.log(data)
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


const handleAdminProfileClick= ()=>{
  navigarion("/admin/profile")
}
  return (
    <header className="sticky top-0 h-16 bg-white border-b-2 border-amber-200 z-30 shadow-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className="lg:hidden p-2 hover:bg-amber-100 rounded-lg transition"
        >
          <Menu className="w-6 h-6 text-amber-700" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-amber-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-amber-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => handleAdminProfileClick()}
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 hover:bg-amber-100 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
                {user?.name[0]}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-amber-900">{user?.name}</p>
                <p className="text-xs text-amber-700">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-amber-700 hidden sm:block" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-2 border-amber-200 py-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 flex items-center gap-2 text-amber-900 font-medium">
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
                <hr className="my-2 border-amber-200" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 font-medium">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
