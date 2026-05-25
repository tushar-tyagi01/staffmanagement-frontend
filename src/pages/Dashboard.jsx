import React, { Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants";
import Spinner from "../components/common/Spinner";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";

const FALLBACK = {
  departmentStats: [
    { name: "Engineering", count: 45 },
    { name: "Sales", count: 30 },
    { name: "Marketing", count: 20 },
    { name: "HR", count: 15 },
    { name: "Finance", count: 10 },
  ],
  attendanceTrend: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    present: Math.floor(Math.random() * 20) + 100,
    absent: Math.floor(Math.random() * 10),
  })),
  leaveDistribution: [
    { name: "Sick Leave", value: 35 },
    { name: "Annual Leave", value: 45 },
    { name: "Casual Leave", value: 15 },
    { name: "Unpaid", value: 5 },
  ],
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Debug: log the actual user role and role constants
  console.log("Dashboard Debug - User role:", user?.role);
  console.log("Dashboard Debug - ROLES.ADMIN:", ROLES.ADMIN);
  console.log("Dashboard Debug - ROLES.HR:", ROLES.HR);

  // Route to appropriate dashboard based on user role
  const isAdmin = user?.role === ROLES.ADMIN;
  const isHR = user?.role === ROLES.HR;
  const isAdminOrHR = isAdmin || isHR;

  console.log("Dashboard Debug - isAdmin:", isAdmin, "isHR:", isHR, "isAdminOrHR:", isAdminOrHR);

  return (
    <Suspense fallback={<Spinner size="lg" />}>
      {isAdminOrHR ? <AdminDashboard /> : <StaffDashboard />}
    </Suspense>
  );
};

export default Dashboard;
