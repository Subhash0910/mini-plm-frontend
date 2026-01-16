import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT, 10) || 30000;

/**
 * Create and configure axios instance with interceptors
 * Handles authentication, error handling, and request/response logging
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Add auth token to headers
 * - Log requests in development
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.REACT_APP_DEBUG_MODE === 'true') {
      console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handle successful responses
 * - Handle errors globally
 * - Refresh token on 401
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.REACT_APP_DEBUG_MODE === 'true') {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Access Forbidden - Insufficient permissions');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.warn('[API] Resource not found');
    }

    // Handle 500+ Server Errors
    if (error.response?.status >= 500) {
      console.error('[API] Server Error', error.response.data);
    }

    // Log all errors
    if (process.env.REACT_APP_DEBUG_MODE === 'true') {
      console.error('[API Error]', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
