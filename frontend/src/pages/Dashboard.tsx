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
        const response = await getLoans()
        setLoans(response);
        // console.log("Fetched loans:", response.data);
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
        setLoans(loans.filter(loan => loan.id !== loanId));
        alert("Loan application deleted successfully");
      } catch (err) {
        setError("Failed to delete loan");
        console.error("Error deleting loan:", err);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-700">CREDIT APP</h1>
            <nav className="flex space-x-4 text-sm text-green-700">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">Payments</a>
              <a href="#" className="hover:underline">Budget</a>
              <a href="#" className="hover:underline">Card</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-green-700">{user ? `${user.name} (${user.role})` : "Guest"}</span>
            <button className="text-sm text-green-700 hover:underline">User ▼</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <img src="/deficit-icon.png" alt="Deficit" className="w-10 h-10" /> {/* Replace with actual path */}
              <div>
                <p className="text-sm text-green-700">DEFICIT</p>
                <p className="text-2xl font-bold text-green-700">₦0.0</p>
              </div>
            </div>
            <button
              onClick={handleGetLoanClick}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Get A Loan
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">Borrow Cash</button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">Transact</button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">Deposit Cash</button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for loans"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Applied Loans</h3>
              <div className="flex space-x-2">
                <button className="text-sm text-gray-500 hover:text-gray-700">Sort</button>
                <button className="text-sm text-gray-500 hover:text-gray-700">Filter</button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 text-sm text-gray-600">Reason</th>
                  <th className="p-2 text-sm text-gray-600">Amount</th>
                  <th className="p-2 text-sm text-gray-600">Date Applied</th>
                  <th className="p-2 text-sm text-gray-600">Status</th>
                  <th className="p-2 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-t">
                    <td className="p-2 text-gray-700">{loan.reason.slice(0, 20)}{loan.reason.length > 20 ? "..." : ""}</td>
                    <td className="p-2 text-gray-700">₦{loan.amount.toLocaleString()}</td>
                    <td className="p-2 text-gray-700">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          loan.status === "PENDING"
                            ? "bg-yellow-200 text-yellow-800"
                            : loan.status === "VERIFIED"
                            ? "bg-green-200 text-green-800"
                            : loan.status === "REJECTED"
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteLoan(loan.id)}
                        className="text-red-500 hover:text-red-700"
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
      </main>
    </div>
  );
};

export default Dashboard;