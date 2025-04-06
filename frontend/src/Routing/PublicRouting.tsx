import { useAuth } from "@/helpers/api-communicators";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
   
     useEffect(() => {
       let isMounted = true;
   
       const checkAuth = async () => {
         const authData = await useAuth();
 
         if (isMounted) {
           setUser(authData);
           setLoading(false);
         }
       };
   
       checkAuth();
   
       return () => {
         isMounted = false;
       };
     }, []);
  
    if (loading) {
      return <div>Loading...</div>; // Show loading state while checking auth
    }
  
    // Redirect to the appropriate dashboard based on role, default to /dashboard
    const redirectPath = user
      ? user.role === "ADMIN"
        ? "/admin"
        : user.role === "VERIFIER"
        ? "/verify"
        : "/dashboard"
      : null;
  
    return !user && !loading ? <>{children}</>: <Navigate to={redirectPath || "/login"} replace />;
  };
  
  export default PublicRoute;