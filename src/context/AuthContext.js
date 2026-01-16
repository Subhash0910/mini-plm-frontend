import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  /**
   * Login user with username and password
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(username, password);
      const { token: newToken, ...userData } = response.data;

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(username, password);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Get current user information
   */
  const getCurrentUser = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await authService.getCurrentUser();
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      // If token is invalid, logout
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  }, [token, logout]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
