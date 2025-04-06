import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Routing/UserContext"; // Adjust path

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGetLoanClick = () => {
    navigate("/loan/apply");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">CREDIT APP</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {user ? `${user.name} (${user.role})` : "Guest"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-gray-600">Welcome, {user ? user.name : "Guest"} ({user ? user.role : "Unknown Role"})</p>
            </div>
            <button
              onClick={handleGetLoanClick}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Get A Loan
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Deficit</h3>
              <p className="text-2xl font-bold text-green-800">₦0.0</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Borrow Cash</h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Deposit Cash</h3>
            </div>
          </div>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Search for loans"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold">Applied Loans</h3>
            <table className="w-full mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Loan Officer</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Date Applied</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">John Okoh <span className="text-gray-500">(Updated 1 day ago)</span></td>
                  <td className="p-2">₦50,000.00</td>
                  <td className="p-2">June 09, 2021</td>
                  <td className="p-2"><span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">PENDING</span></td>
                </tr>
                <tr>
                  <td className="p-2">John Okoh <span className="text-gray-500">(Updated 1 day ago)</span></td>
                  <td className="p-2">₦100,000.00</td>
                  <td className="p-2">June 07, 2021</td>
                  <td className="p-2"><span className="bg-green-200 text-green-800 px-2 py-1 rounded">VERIFIED</span></td>
                </tr>
                <tr>
                  <td className="p-2">John Okoh <span className="text-gray-500">(Updated 1 day ago)</span></td>
                  <td className="p-2">₦100,000.00</td>
                  <td className="p-2">June 07, 2021</td>
                  <td className="p-2"><span className="bg-red-200 text-red-800 px-2 py-1 rounded">REJECTED</span></td>
                </tr>
                <tr>
                  <td className="p-2">John Okoh <span className="text-gray-500">(Updated 1 day ago)</span></td>
                  <td className="p-2">₦100,000.00</td>
                  <td className="p-2">May 27, 2021</td>
                  <td className="p-2"><span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">APPROVED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;