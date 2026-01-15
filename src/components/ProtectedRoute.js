import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/auth";

function ProtectedRoute({ children }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
