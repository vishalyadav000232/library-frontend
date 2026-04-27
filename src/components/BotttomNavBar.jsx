import React from "react";
import { Home, Armchair, User, ClipboardClock } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNavBar = () => {
  const navData = [
    { name: "Home", path: "/dashboard/home", icon: Home },
    { name: "Seats", path: "/dashboard/seats", icon: Armchair },
    { name: "Bookings", path: "/dashboard/my-bookings", icon: ClipboardClock },
    { name: "Profile", path: "/dashboard/profile", icon: User, isProfile: true },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-amber-200 shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16 px-2">

          {navData.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink key={index} to={item.path} className="flex-1">
                {({ isActive }) => (
                  <div
                    className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-200 ${
                      item.isProfile
                        ? "text-white bg-gradient-to-r from-amber-600 to-orange-600 mx-1"
                        : isActive
                        ? "text-amber-700 bg-amber-100"
                        : "text-gray-500 hover:text-amber-600"
                    }`}
                  >
                    <Icon
                      className={`${
                        isActive ? "h-6 w-6" : "h-5 w-5"
                      } transition-all`}
                    />
                    <span className="text-xs font-medium">
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* Spacer (important) */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default BottomNavBar;