import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Routing/UserContext"; // Adjust path
import { getAllLoans, logout, updateLoanStatus } from "@/helpers/api-communicators";
import { toast } from "sonner";

interface Loan {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: {
    name: string;
  };
}

interface VerifierStats {
  loans: number;
  borrowers: number;
  cashDisbursed: number;
  savings: number;
  repaidLoans: number;
  cashReceived: number;
}

const VerifyDashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats] = useState<VerifierStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null); // State for the popup

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "VERIFIER") {
        setError("Access denied: Verifier role required");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const loansResponse = await getAllLoans();
        setLoans(loansResponse.map((loan) => ({ ...loan, createdAt: loan.createdAt.toString() })));

      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (loanId: string, newStatus: "VERIFIED" | "REJECTED") => {
    try {
      await updateLoanStatus(loanId, newStatus);
      setSelectedLoan(null); // Close popup after update
      setLoans((prevLoans) =>
        prevLoans.map((loan) => (loan.id === loanId ? { ...loan, status: newStatus } : loan))
      );
      toast.success(`Loan status updated to ${newStatus}`);
    } catch (err) {
      setError("Failed to update loan status");
      console.error("Error updating loan status:", err);
    }
  };

  const openPopup = (loan: Loan) => {
    setSelectedLoan(loan);
  };

  const closePopup = () => {
    setSelectedLoan(null);
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
            <button className="text-sm text-green-700 hover:underline">Verifier</button>
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
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Dashboard</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Borrowers</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Loans</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Repayments</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Loan Parameters</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Accounting</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Reports</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Collateral</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">E-Sign Configuration</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Savings</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Expenses</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">E-Signature</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Investor Accounts</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Calendar</a>
            <a href="#" className="block p-2 hover:bg-green-700 rounded">Settings</a>
            {/* <a href="#" className="block p-2 hover:bg-green-700 rounded text-red-300">Sign Out</a> */}
            <button className="block w-full text-left p-2 hover:bg-green-700 rounded text-red-300" onClick={ async() => {
                            await logout();
                          toast.success("Signed out successfully");
                          navigate("/login");
                        }}>
                          Sign Out
                        </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700">Dashboard -- Loans</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <p className="text-sm text-green-700">LOANS</p>
              <p className="text-2xl font-bold">{stats?.loans || 0}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <p className="text-sm text-green-700">BORROWERS</p>
              <p className="text-2xl font-bold">{stats?.borrowers || 0}</p>
            </div>
            <div className="bg-green-800 text-white p-4 shadow rounded-lg text-center">
              <p className="text-sm">CASH DISBURSED</p>
              <p className="text-2xl font-bold">{stats?.cashDisbursed?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-green-800 text-white p-4 shadow rounded-lg text-center">
              <p className="text-sm">CASH RECEIVED</p>
              <p className="text-2xl font-bold">{stats?.cashReceived?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <p className="text-sm text-green-700">SAVINGS</p>
              <p className="text-2xl font-bold">{stats?.savings?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg text-center">
              <p className="text-sm text-green-700">REPAID LOANS</p>
              <p className="text-2xl font-bold">{stats?.repaidLoans || 0}</p>
            </div>
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
                  <th className="p-2 text-sm text-gray-600">User Recent Activity</th>
                  <th className="p-2 text-sm text-gray-600">Customer name</th>
                  <th className="p-2 text-sm text-gray-600">Date</th>
                  <th className="p-2 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
              {loans.map((loan) => (
                  <tr key={loan.id} className="border-t">
                    <td className="p-2 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}>
                          {loan.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p>{loan.reason.slice(0, 30)}{loan.reason.length > 30 ? "..." : ""}</p>
                          <p className="text-sm text-gray-500">Updated {loan.createdAt ? "1 day ago" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-gray-700">{loan.customerName}</td>
                    <td className="p-2 text-gray-700">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => openPopup(loan)}
                        className={`px-2 py-1 rounded text-white ${
                          loan.status === "PENDING"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : loan.status === "VERIFIED"
                            ? "bg-green-500 hover:bg-green-600"
                            : loan.status === "REJECTED"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {loan.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm text-gray-500">
              Rows per page: 7 <span className="mx-2">|</span> 1-7 of {loans.length} <span className="mx-2">|</span> <button>«</button> <button>»</button>
            </div>
          </div>

          {/* Popup for Status Update */}
          {selectedLoan && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Update Status for Loan #{selectedLoan.id}</h3>
                <p>Current Status: {selectedLoan.status}</p>
                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => handleUpdateStatus(selectedLoan.id, "VERIFIED")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLoan.id, "REJECTED")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={closePopup}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VerifyDashboard;