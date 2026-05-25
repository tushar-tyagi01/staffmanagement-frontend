import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../common/AdminSidebar";
import AdminNavbar from "../common/AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex">
        <AdminSidebar
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

export default AdminLayout;
