import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { STAFF_NAV_ITEMS } from "../../utils/constants";
import { LogOut } from "lucide-react";

const StaffSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const nav = STAFF_NAV_ITEMS;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen lg:h-auto w-64 lg:w-64 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold">Staff</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  {item.icon && (
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  )}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default StaffSidebar;
