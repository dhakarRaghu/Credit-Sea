import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../Routing/UserContext"; // Adjust path
import { toast } from "sonner";
import { deleteUser, getAllUsers, logout } from "@/helpers/api-communicators";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VERIFIER" | "USER";
}

const UserManagement: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== "ADMIN") {
        setError("Access denied: Admin role required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getAllUsers();
           //@ts-ignore
        setUsers(response);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId); // Adjust API call as needed
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      } catch (err) {
        setError("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

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

  if (error) {
    return <div className="min-h-screen bg-gray-200 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-700">CREDIT APP</h1>
            <Link to="/admin" className="text-sm text-green-700 hover:underline">Admin</Link>
            <span className="text-sm text-green-700">Admin Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-green-700">{user ? `${user.name} (${user.role})` : "Guest"}</span>
            <button className="text-sm text-green-700 hover:underline">User ▼</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-green-800 text-white p-4">
          <div className="flex items-center mb-4">
            <span className="text-green-300 mr-2">👤</span>
            <span className="font-bold">{user?.name || "Guest"}</span>
          </div>
          <nav className="space-y-2">
            <Link to="/admin" className="block p-2 hover:bg-green-700 rounded">Dashboard</Link>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Borrowers</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Loans</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Repayments</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Loan Parameters</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Accounting</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Reports</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Collateral</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">E-Sign Configuration</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Savings</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Other Incomes</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Payroll</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Expenses</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">E-Signature</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Investor Accounts</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Calendar</a>
            <Link to="/admin/usermanagement" className="block p-2 hover:bg-green-700 rounded">User Management</Link>
            {/* <a href="#" className="block p-2 hover:bg-green-700 rounded text-red-300">Sign Out</a>  */}
            <button className="block w-full text-left p-2 hover:bg-green-700 rounded text-red-300" onClick={ async() => {
                await logout()
              toast.success("Signed out successfully");
              navigate("/login");
            }}>
              Sign Out
            </button>


          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">User Management</h3>
              <div className="flex space-x-2">
                <button className="text-sm text-gray-500 hover:text-gray-700">Sort</button>
                <button className="text-sm text-gray-500 hover:text-gray-700">Filter</button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 text-sm text-gray-600">User Details</th>
                  <th className="p-2 text-sm text-gray-600">Name</th>
                  <th className="p-2 text-sm text-gray-600">Email</th>
                  <th className="p-2 text-sm text-gray-600">Role</th>
                  <th className="p-2 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <img src="/user-icon.png" alt="User" className="w-8 h-8 rounded-full" /> {/* Replace with actual path */}
                        <div>
                          <p>{user.name}</p>
                          <p className="text-sm text-gray-500">Updated 1 day ago</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700">{user.name}</td>
                    <td className="p-2 text-gray-700">{user.email}</td>
                    <td className="p-2 text-gray-700">{user.role}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm text-gray-500">
              Rows per page: 7 <span className="mx-2">|</span> 1-7 of {users.length} <span className="mx-2">|</span> <button>«</button> <button>»</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;