import React from 'react';
import { Navigate } from 'react-router-dom'; 

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;
