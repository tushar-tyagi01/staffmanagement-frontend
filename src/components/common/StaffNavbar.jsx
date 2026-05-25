import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

const StaffNavbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6">
      <div className="flex items-center">
        <button
          onClick={onOpenSidebar}
          className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">My Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default StaffNavbar;
