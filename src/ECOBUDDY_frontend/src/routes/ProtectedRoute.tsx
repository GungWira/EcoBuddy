import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const ProtectedRoute: React.FC = () => {
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    if (!isAuth) {
      return;
    }
  }, [loading]);

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
