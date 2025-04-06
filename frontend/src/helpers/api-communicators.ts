import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
});

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
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
  const res = await api.post("/signup", { name, email, password, role });
  console.log("res for signup", res);
  if (res.status !== 201) {
    throw new Error("Unable to signup");
  }
  return res.data;
};

export const useAuth = async () => {
  const res = await api.get("/getMe");
  console.log("authdat", res);
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
