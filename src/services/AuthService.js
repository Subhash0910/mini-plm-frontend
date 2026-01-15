import apiClient from "./apiClient";
import { auth } from "./auth";

const AuthService = {
  signup: async ({ username, email, password }) => {
    const res = await apiClient.post("/auth/signup", { username, email, password });
    auth.setAuth(res.data);
    return res.data;
  },

  login: async ({ username, password }) => {
    const res = await apiClient.post("/auth/login", { username, password });
    auth.setAuth(res.data);
    return res.data;
  },

  logout: () => {
    auth.clear();
  },
};

export default AuthService;
