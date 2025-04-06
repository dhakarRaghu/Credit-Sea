import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
});

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  return res.data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "USER"
) => {
  const res = await api.post("/auth/signup", { name, email, password, role });
  if (res.status !== 201) {
    throw new Error("Unable to signup");
  }
  return res.data;
};

export const useAuth = async () => {
  const res = await api.get("/getMe"); // Use /me instead of /auth-status
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};

export const sendChatRequest = async (message: string) => {
  const res = await api.post("/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  return res.data;
};

export const getUserChats = async () => {
  const res = await api.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to get chats");
  }
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await api.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};