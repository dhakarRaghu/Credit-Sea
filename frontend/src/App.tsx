import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyDashboard from "./pages/VerifyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["USER"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <PrivateRoute allowedRoles={["VERIFIER"]}>
              <VerifyDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </main>
  );
}

export default App;