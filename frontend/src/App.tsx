import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VerifyDashboard from "./pages/VerifyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./Routing/PrivateRoute";
// import PublicRoute from "./Routing/PublicRouting";
import { UserProvider } from "../src/Routing/UserContext"; // Adjust path as needed
import ApplyPage from "./pages/ApplyPage";
import UserManagement from "./pages/UserManagement";

const App: React.FC = () => {
  console.log("Rendering App with path:", window.location.pathname);
  return (
    <UserProvider>
      <main>
        <Routes>
         
          {/* Public Routes */}
          {/* <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          /> */}
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
            path="/loan/apply"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <ApplyPage />
              </PrivateRoute>
            }
          />
            <Route
              path="/admin/management"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <UserManagement />
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
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Default route */}
        </Routes>
      </main>
    </UserProvider>
  );
};

export default App;