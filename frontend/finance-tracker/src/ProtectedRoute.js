import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();

  if (!authState.token) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children;  // Render the protected content (Expenses page)
};

export default ProtectedRoute;
