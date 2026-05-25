import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Settings,
  BarChart2,
  Clock,
} from "lucide-react";

export const ROLES = {
  ADMIN: "admin",
  HR: "hr",
  MANAGER: "manager",
  EMPLOYEE: "staff",
};

// Admin-specific navigation (admin + HR)
export const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Staff Management", path: "/employees", icon: Users },
  { name: "Attendance Management", path: "/attendance", icon: CalendarCheck },
  { name: "Leave Requests", path: "/leaves", icon: CalendarDays },
  { name: "Reports & Analytics", path: "/reports", icon: BarChart2 },
  { name: "Settings", path: "/settings", icon: Settings },
];

// Manager navigation with a narrower permission set
export const MANAGER_NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Attendance Review", path: "/attendance", icon: CalendarCheck },
  { name: "Leave Requests", path: "/leaves", icon: CalendarDays },
  { name: "Settings", path: "/settings", icon: Settings },
];

// Staff navigation for employee users
export const STAFF_NAV_ITEMS = [
  { name: "My Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Attendance", path: "/my-attendance", icon: Clock },
  { name: "My Leaves", path: "/my-leaves", icon: CalendarDays },
  { name: "Settings", path: "/settings", icon: Settings },
];

// Backwards-compatible combined navigation with explicit role permissions
export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    name: "Staff Management",
    path: "/employees",
    icon: Users,
    roles: [ROLES.ADMIN, ROLES.HR],
  },
  {
    name: "Attendance Management",
    path: "/attendance",
    icon: CalendarCheck,
    roles: [ROLES.ADMIN, ROLES.HR],
  },
  {
    name: "Attendance Review",
    path: "/attendance",
    icon: CalendarCheck,
    roles: [ROLES.MANAGER],
  },
  {
    name: "Leave Requests",
    path: "/leaves",
    icon: CalendarDays,
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER],
  },
  {
    name: "Reports & Analytics",
    path: "/reports",
    icon: BarChart2,
    roles: [ROLES.ADMIN, ROLES.HR],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE],
  },
  {
    name: "My Attendance",
    path: "/my-attendance",
    icon: Clock,
    roles: [ROLES.EMPLOYEE],
  },
  {
    name: "My Leaves",
    path: "/my-leaves",
    icon: CalendarDays,
    roles: [ROLES.EMPLOYEE],
  },
];
