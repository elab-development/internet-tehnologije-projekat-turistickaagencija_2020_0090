import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RequireAuth = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { status, role } = useAuth();

  if (status === 'loading') {
    return <div className="text-center text-gray-600">Provera autorizacije...</div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    const fallbackRole = role || localStorage.getItem('user_role') || 'client';
    return <Navigate to={`/dashboard/${fallbackRole}`} replace />;
  }

  return children;
};

export default RequireAuth;
