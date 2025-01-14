import { Routes, Route, Navigate } from "react-router";

// Page Imports
import Home from "../pages/Home";
// import ProtectedRoute from "./ProtectedRoute";

function Router() {
  return (
    <Routes>
        hai
        <Route index element={<Home />} />
        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute redirectTo="/" />}>
          
        </Route> */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default Router;