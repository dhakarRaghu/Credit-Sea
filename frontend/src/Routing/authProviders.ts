// import { useState, useEffect } from "react";
// import { loginUser, logoutUser, signupUser, checkAuthStatus } from "../helpers/api-communicators";

// type User = { id: string; name: string; email: string; role: string };

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkStatus();
//   }, []);

//   const checkStatus = async () => {
//     try {
//       const data = await checkAuthStatus();
//       if (data) {
//         setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
//         setIsLoggedIn(true);
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     const data = await loginUser(email, password);
//     if (data.user) {
//       setUser({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role });
//       setIsLoggedIn(true);
//     }
//   };

//   const signup = async (name: string, email: string, password: string, role?: string) => {
//     const data = await signupUser(name, email, password, role);
//     if (data.user) {
//       setUser({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role });
//       setIsLoggedIn(true);
//     }
//   };

//   const logout = async () => {
//     await logoutUser();
//     setIsLoggedIn(false);
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return { user, isLoggedIn, loading, login, signup, logout };
// };