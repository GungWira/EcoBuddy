import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Premium from "../pages/Chat/Premium";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../hooks/AuthProvider";
import Quiz from "../pages/Quiz";
import Start from "../pages/Quiz/Start";
import Result from "../pages/Quiz/Result";
import Garden from "../pages/Garden";

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
      <Route path="/garden" element={<Garden />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/premium" element={<Premium />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/start" element={<Start />} />
        <Route path="/quiz/result" element={<Result />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Router;
