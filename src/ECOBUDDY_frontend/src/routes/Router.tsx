import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Premium from "../pages/Chat/Premium";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../hooks/AuthProvider";
import Quiz from "../pages/Chat/Quiz";

function Router() {
  const { isAuth } = useAuth();

  // if (!isAuth) {
  //   return null; // Tunggu sampai konteks dimuat
  // }

  return (
    <Routes>
      <Route
        index
        element={isAuth ? <Navigate to="/chat" replace /> : <Home />}
      />
      <Route path="/quiz" element={<Quiz />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/premium" element={<Premium />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Router;
