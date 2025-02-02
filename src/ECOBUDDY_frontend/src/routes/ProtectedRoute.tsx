import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const ProtectedRoute: React.FC = () => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return null; // Pastikan konteks ada
  }

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
