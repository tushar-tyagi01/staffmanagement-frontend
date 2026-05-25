import React, { Suspense, lazy } from "react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const AdminDashboard = lazy(() => import("../../pages/AdminDashboard"));
const StaffDashboard = lazy(() => import("../../pages/StaffDashboard"));
import Spinner from "../common/Spinner";

const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="h-64 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }
  >
    {children}
  </Suspense>
);

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  if ([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER].includes(user.role)) {
    return (
      <SuspenseWrapper>
        <AdminDashboard />
      </SuspenseWrapper>
    );
  }

  // Default to staff dashboard
  return (
    <SuspenseWrapper>
      <StaffDashboard />
    </SuspenseWrapper>
  );
};

export default DashboardRouter;
