import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutRouter from "../components/common/LayoutRouter";
import DashboardRouter from "../components/common/DashboardRouter";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Spinner from "../components/common/Spinner";
import { ROLES } from "../utils/constants";

// Lazy loaded pages
const Login = lazy(() => import("../pages/Login"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const SetupPassword = lazy(() => import("../pages/SetupPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Employees = lazy(() => import("../pages/Employees"));
const Departments = lazy(() => import("../pages/Departments"));
const Attendance = lazy(() => import("../pages/Attendance"));
const Leaves = lazy(() => import("../pages/Leaves"));
const Reports = lazy(() => import("../pages/Reports"));
const AddEmployee = lazy(() => import("../pages/AddEmployee"));
const Settings = lazy(() => import("../pages/Settings"));

const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/unauthorized",
    element: (
      <SuspenseWrapper>
        <Unauthorized />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/setup-password",
    element: (
      <SuspenseWrapper>
        <SetupPassword />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute
        allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE]}
      >
        <LayoutRouter />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            allowedRoles={[
              ROLES.ADMIN,
              ROLES.HR,
              ROLES.MANAGER,
              ROLES.EMPLOYEE,
            ]}
          >
            <SuspenseWrapper>
              <DashboardRouter />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      // Placeholders for other routes to be implemented
      {
        path: "employees",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <SuspenseWrapper>
              <Employees />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "employees/new",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <SuspenseWrapper>
              <AddEmployee />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "departments",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <SuspenseWrapper>
              <Departments />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]}>
            <SuspenseWrapper>
              <Attendance />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "my-attendance",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER]}>
            <SuspenseWrapper>
              <Attendance />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "leaves",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER]}>
            <SuspenseWrapper>
              <Leaves />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "my-leaves",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER]}>
            <SuspenseWrapper>
              <Leaves />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
            <SuspenseWrapper>
              <Reports />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute
            allowedRoles={[
              ROLES.ADMIN,
              ROLES.HR,
              ROLES.MANAGER,
              ROLES.EMPLOYEE,
            ]}
          >
            <SuspenseWrapper>
              <Settings />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
