import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Settings, LogOut, ChevronDown, Bell } from "lucide-react";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {user?.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="py-2">
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </Link>
            <button
              onClick={logout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
