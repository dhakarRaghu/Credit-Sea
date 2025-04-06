import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../helpers/api-communicators";
import { useUser } from "./UserContext"; // Adjust path as needed

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PrivateRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log("Calling useAuth...");
        const authData = await useAuth();
        console.log("useAuth response:", authData);
        if (isMounted && authData) {
          setUser(authData);
        } else {
          console.log("No auth data received");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  console.log("Current user in PrivateRoute (from context):", useUser().user, "Loading:", loading, "Error:", error);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const user = useUser().user;
  if (!user) {
    console.log("No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("Role mismatch, redirecting to /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;