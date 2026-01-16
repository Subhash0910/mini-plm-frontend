// src/services/api.js - Comprehensive API Client Service

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('authToken', token);
          apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh-token', { refreshToken }),
  logout: () => apiClient.post('/auth/logout'),
};

export const productAPI = {
  getAll: (params = {}) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  search: (query) => apiClient.get('/products/search', { params: { q: query } }),
};

export const changeAPI = {
  getAll: (params = {}) => apiClient.get('/changes', { params }),
  getById: (id) => apiClient.get(`/changes/${id}`),
  create: (data) => apiClient.post('/changes', data),
  update: (id, data) => apiClient.put(`/changes/${id}`, data),
  delete: (id) => apiClient.delete(`/changes/${id}`),
  approve: (id, comment = '') => apiClient.post(`/changes/${id}/approve`, { comment }),
  reject: (id, reason = '') => apiClient.post(`/changes/${id}/reject`, { reason }),
  getHistory: (id) => apiClient.get(`/changes/${id}/history`),
};

export const partAPI = {
  getAll: (params = {}) => apiClient.get('/parts', { params }),
  getById: (id) => apiClient.get(`/parts/${id}`),
  create: (data) => apiClient.post('/parts', data),
  update: (id, data) => apiClient.put(`/parts/${id}`, data),
  delete: (id) => apiClient.delete(`/parts/${id}`),
  getVersions: (id) => apiClient.get(`/parts/${id}/versions`),
  getByProduct: (productId) => apiClient.get(`/parts`, { params: { productId } }),
};

export const documentAPI = {
  getAll: (params = {}) => apiClient.get('/documents', { params }),
  getById: (id) => apiClient.get(`/documents/${id}`),
  upload: (formData) => apiClient.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => apiClient.delete(`/documents/${id}`),
  download: (id) => apiClient.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export const dashboardAPI = {
  getMetrics: () => apiClient.get('/dashboard/metrics'),
  getRecentActivity: (limit = 10) => apiClient.get('/dashboard/activity', { params: { limit } }),
  getPendingApprovals: () => apiClient.get('/dashboard/pending-approvals'),
  getSystemStatus: () => apiClient.get('/dashboard/status'),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  changePassword: (oldPassword, newPassword) =>
    apiClient.put('/users/change-password', { oldPassword, newPassword }),
  getAll: (params = {}) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

export default apiClient;
