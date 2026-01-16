import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ username, password });

      const { token: authToken, refreshToken, user: userData } = response.data;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);

      setToken(authToken);
      setUser(userData);

      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      const { token: authToken, refreshToken, user: newUser } = response.data;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);

      setToken(authToken);
      setUser(newUser);

      return { success: true, data: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};