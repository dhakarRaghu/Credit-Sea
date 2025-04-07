import { useAuth } from "@/helpers/api-communicators";
import { useEffect, useState } from "react";
import { Navigate} from "react-router-dom";

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
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      );
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