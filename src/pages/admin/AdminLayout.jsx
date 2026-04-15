import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./ui/Header";

const AdminLayout = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <SideBar
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Right Section */}
      <div className="flex flex-col flex-1 lg:ml-64">
        
        {/* Header */}
        <Header setShowMobileMenu={setShowMobileMenu} />

        {/* Main Content */}
        <main className="flex-1  overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
