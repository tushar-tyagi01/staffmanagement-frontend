import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ADMIN_NAV_ITEMS,
  MANAGER_NAV_ITEMS,
  ROLES,
} from "../../utils/constants";
import { LogOut } from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const filteredNav =
    user?.role === ROLES.MANAGER ? MANAGER_NAV_ITEMS : ADMIN_NAV_ITEMS;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen lg:h-auto w-72 lg:w-72 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">
            Admin Console
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav>
            <ul className="space-y-1">
              {filteredNav.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`
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
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex w-full items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
