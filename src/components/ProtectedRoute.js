import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/auth";

function ProtectedRoute({ children, requiredRoles }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = auth.getUser();
  if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    if (!user?.role || !requiredRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
