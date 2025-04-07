import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
});

interface Loan {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
  verifiedById?: string;
  approvedById?: string;
  rejectedById?: string;
  rejectionReason?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other fields as needed
}

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  console.log("res for login", res.data);
  return res.data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "USER"
) => {
  const res = await api.post("/signup", { name, email, password, role });
  if (res.status !== 201) {
    throw new Error("Unable to signup");
  }
  console.log("res for signup", res.data);
  return res.data;
};

export const useAuth = async () => {
  const res = await api.post("/getMe");
  console.log("authdat getMe", res.data);
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};

export const createLoan = async (loanData: Omit<Loan, "id" | "createdAt" | "updatedAt" | "status" | "verifiedById" | "approvedById" | "rejectedById" | "rejectionReason">): Promise<Loan> => {
  try {
    const res = await api.post("/loan/apply", loanData, { withCredentials: true });
    if (res.status !== 201) {
      throw new Error("Failed to create loan");
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to create loan");
    }
    throw error;
  }
};

export const getLoans = async (): Promise<Loan[]> => {
  try {
    const res = await api.get("/loan", { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to fetch loans");
    }
    console.log("res for loans", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch loans");
    }
    throw error;
  }
};

export const getAllLoans = async (): Promise<Loan[]> => {
  try {
    const res = await api.get("/loan/verify", { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to fetch all loans");
    }
    console.log("res for all loans", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch all loans");
    }
    throw error;
  }
}

export const updateLoanStatus = async (loanId: string, status: "VERIFIED" | "REJECTED", rejectionReason?: string): Promise<Loan> => {
  try {
    const res = await api.put(`/loan/verify/${loanId}`, { status, rejectionReason }, { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to update loan status");
    }
    console.log("res for update loan status", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to update loan status");
    }
    throw error;
  }
};
export const updateLoanStatusByAdmin = async (loanId: string, status: "APPROVED" | "REJECTED", rejectionReason?: string): Promise<Loan> => {
  try {
    const res = await api.put(`/loan/admin/${loanId}`, { status, rejectionReason }, { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to update loan status");
    }
    console.log("res for update loan status", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to update loan status");
    }
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get("/users", { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to fetch all users");
    }
    console.log("res for all users", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch all users");
    }
    throw error;
  }
};

export const deleteUser = async (userId : string) => {
  try {
    const res = await api.delete(`/users/${userId}`, { withCredentials: true });
    if (res.status !== 200) {
      throw new Error("Failed to fetch all users");
    }

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch all users");
    }
    throw error;
  }
};

import Cookies from "js-cookie";

export const logout = async () => {
  try {
    Cookies.remove("token");
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
};