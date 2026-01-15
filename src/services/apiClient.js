import axios from "axios";
import { auth } from "./auth";

// CRA dev proxy handles localhost:8080, so frontend can call /api/*
// For non-proxy / deployed environments, set REACT_APP_API_BASE_URL (e.g. https://example.com/api)
const baseURL = process.env.REACT_APP_API_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid/expired, clear and let UI redirect naturally.
    if (error?.response?.status === 401) {
      auth.clear();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
