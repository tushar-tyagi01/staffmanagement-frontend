import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Check if the user is authenticated and has the required role
  const isAuthorized = user && allowedRoles.includes(user.role);

  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    // User is authenticated but not authorized, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the children components
  return children;
};

export default ProtectedRoute;