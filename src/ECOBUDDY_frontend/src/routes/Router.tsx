import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Premium from "../pages/Chat/Premium";
import ProtectedRoute from "./ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "../hooks/AuthContext";
// import ProtectedRoute from "./ProtectedRoute";

function Router() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // Tunggu sampai konteks dimuat
  }

  const { isAuthenticated } = auth;
  return (
    <Routes>
      hai
      <Route
        index
        element={isAuthenticated ? <Navigate to="/chat" replace /> : <Home />}
      />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/premium" element={<Premium />} />
      </Route>
      {/* <Route element={<ProtectedRoute redirectTo="/" />}>
          
        </Route> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Router;
