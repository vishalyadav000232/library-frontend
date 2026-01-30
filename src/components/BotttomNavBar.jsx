import React from "react";
import { Home, Calendar, Armchair, User, ClipboardClock } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNavBar = () => {
  const navData = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Seats", path: "/seats", icon: Armchair },
    { name: "Bookings", path: "/my-bookings", icon: ClipboardClock },
    { name: "Profile", path: "/profile", icon: User, isProfile: true },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-amber-200 shadow-lg md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {navData.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  item.isProfile
                    ? "flex flex-col items-center justify-center  px-5 py-2.5 rounded-2xl   hover:shadow-2xl transition-all duration-300 min-w-[70px]"
                    : `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                        isActive
                          ? "text-black-700 bg-amber-10"
                          : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/50"
                      }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`${
                        item.isProfile
                          ? "h-6 w-6"
                          : isActive
                          ? "h-6 w-6"
                          : "h-5 w-5"
                      } transition-all duration-200`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        item.isProfile ? "mt-0.5" : "mt-0"
                      }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Spacer - prevents content from being hidden behind navbar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
};

export default BottomNavBar;
