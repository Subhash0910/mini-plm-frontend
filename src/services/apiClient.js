import axios from "axios";
import { auth } from "./auth";

// CRA dev proxy handles localhost:8080, so frontend can call /api/*
// For non-proxy / deployed environments, set REACT_APP_API_BASE_URL (e.g. https://example.com/api)
const baseURL = process.env.REACT_APP_API_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL,
  timeout: 20000,
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

function extractBestMessage(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  // Common Spring Boot error shapes: { message }, { error }, string, etc.
  const messageFromObject =
    (data && typeof data === "object" && (data.message || data.error)) || null;

  if (messageFromObject) return String(messageFromObject);
  if (typeof data === "string" && data.trim()) return data;

  // Axios network errors
  if (error?.code === "ECONNABORTED") return "Request timed out";
  if (!status) return "Network error: backend not reachable";

  return "Request failed";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Attach a normalized message (non-breaking; components can ignore it).
    error.userMessage = extractBestMessage(error);

    // If token is invalid/expired, clear and let UI redirect naturally.
    if (error?.response?.status === 401) {
      auth.clear();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
