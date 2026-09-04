import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Crucial: Wait until auth state is resolved to prevent redirect flicker on reload
  if (loading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login, remembering the route they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles required, check user role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user doesn't have permission for this dashboard, redirect to their own dashboard or home
    if (user?.role === 'Tenant') return <Navigate to="/dashboard/tenant" replace />;
    if (user?.role === 'Owner') return <Navigate to="/dashboard/owner" replace />;
    if (user?.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
