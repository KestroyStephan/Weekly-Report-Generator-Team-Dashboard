import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RoleRoute({ roles = [] }) {
  const { user } = useAuthStore();
  
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/my-report" replace />;
  }
  
  return <Outlet />;
}
