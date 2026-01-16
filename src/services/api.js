import axios from 'axios';

/**
 * API Service
 * Central service for all backend communication
 * Handles authentication, token management, and error handling
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If 401 (Unauthorized), token might be expired
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),

  register: (username, password) =>
    api.post('/auth/register', { username, password }),

  getCurrentUser: () => api.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Health endpoints
export const healthService = {
  checkStatus: () => api.get('/health/status'),
  getDetailed: () => api.get('/health/detailed'),
};

export default api;
