import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Install if not present: npm install axios
import { useUser } from "../Routing/UserContext"; // Adjust path
import { getLoans } from "@/helpers/api-communicators";

interface Loan {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
  createdAt: string; // Assuming date as string from API
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await getLoans();
        //@ts-ignore
        setLoans(response);
      } catch (err) {
        setError("Failed to fetch loans");
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [user]);

  const handleGetLoanClick = () => {
    navigate("/loan/apply");
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (window.confirm("Are you sure you want to delete this loan application?")) {
      try {
        await axios.delete(`/api/loans/${loanId}`, { withCredentials: true });
        setLoans(loans.filter((loan) => loan.id !== loanId));
        alert("Loan application deleted successfully");
      } catch (err) {
        setError("Failed to delete loan");
        console.error("Error deleting loan:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-green-700">CREDIT APP</h1>
            <nav className="flex space-x-6 text-sm font-medium">
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors">Home</a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors">Payments</a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors">Budget</a>
              <a href="#" className="text-green-700 hover:text-green-900 transition-colors">Card</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-green-700">
              {user ? `${user.name} (${user.role})` : "Guest"}
            </span>
            <div className="relative">
              <button className="text-sm text-green-700 hover:text-green-900 transition-colors">
                User ▼
              </button>
              {/* Simple dropdown (can be enhanced with a real menu) */}
              <div className="hidden absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-xl">💸</span> {/* Replace with actual deficit icon path if available */}
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">DEFICIT</p>
                <p className="text-2xl font-bold text-green-900">₦0.0</p>
              </div>
            </div>
            <button
              onClick={handleGetLoanClick}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Get A Loan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Borrow Cash
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Transact
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Deposit Cash
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for loans"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Applied Loans</h3>
              <div className="flex space-x-4">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sort
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 text-sm font-semibold text-gray-600">Reason</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Date Applied</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">{loan.reason.slice(0, 20)}{loan.reason.length > 20 ? "..." : ""}</td>
                      <td className="p-3 text-gray-700">₦{loan.amount.toLocaleString()}</td>
                      <td className="p-3 text-gray-700">{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            loan.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : loan.status === "VERIFIED"
                              ? "bg-green-100 text-green-800"
                              : loan.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;