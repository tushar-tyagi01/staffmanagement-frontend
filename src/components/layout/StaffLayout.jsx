import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../common/StaffSidebar";
import StaffNavbar from "../common/StaffNavbar";

const StaffLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StaffNavbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex">
        <StaffSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
