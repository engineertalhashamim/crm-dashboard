import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!userData) return <Navigate to="/login" replace />;

  // role-based access
  return userData ? children : <Navigate to="/login" />;
};
export default ProtectedRoute;