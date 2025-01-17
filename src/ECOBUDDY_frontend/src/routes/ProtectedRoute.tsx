import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

const ProtectedRoute: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // Pastikan konteks ada
  }

  const { isAuthenticated } = auth;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
