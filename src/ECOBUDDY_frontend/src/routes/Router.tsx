import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Premium from "../pages/Chat/Premium";
// import ProtectedRoute from "./ProtectedRoute";

function Router() {
  return (
    <Routes>
      hai
      <Route index element={<Home />} />
      {/* Protected Routes */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/premium" element={<Premium />} />
      {/* <Route element={<ProtectedRoute redirectTo="/" />}>
          
        </Route> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default Router;
