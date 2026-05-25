import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";
import AdminLayout from "../../components/layout/AdminLayout";
import StaffLayout from "../../components/layout/StaffLayout";

const LayoutRouter = ({ children }) => {
  const { user } = useAuth();

  // Fallback to staff layout when user role is employee, otherwise admin layout
  const isStaff = user?.role === ROLES.EMPLOYEE;

  if (isStaff) {
    return <StaffLayout>{children}</StaffLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default LayoutRouter;
