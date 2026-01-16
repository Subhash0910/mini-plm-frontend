import axiosInstance from './axiosConfig';

/**
 * Centralized API Service
 * All API calls go through this service for consistency and maintainability
 */

const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  const errorCode = error.response?.status || 'UNKNOWN';
  throw {
    message: errorMessage,
    code: errorCode,
    details: error.response?.data,
  };
};

// ==================== AUTH ENDPOINTS ====================
export const AuthAPI = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== PRODUCTS ENDPOINTS ====================
export const ProductAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (productData) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== PARTS ENDPOINTS ====================
export const PartAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/parts', { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/parts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (partData) => {
    try {
      const response = await axiosInstance.post('/parts', partData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, partData) => {
    try {
      const response = await axiosInstance.put(`/parts/${id}`, partData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/parts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== CHANGES ENDPOINTS ====================
export const ChangeAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/changes', { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/changes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (changeData) => {
    try {
      const response = await axiosInstance.post('/changes', changeData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, changeData) => {
    try {
      const response = await axiosInstance.put(`/changes/${id}`, changeData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/changes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  submit: async (id) => {
    try {
      const response = await axiosInstance.post(`/changes/${id}/submit`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  approve: async (id) => {
    try {
      const response = await axiosInstance.post(`/changes/${id}/approve`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  reject: async (id, reason) => {
    try {
      const response = await axiosInstance.post(`/changes/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== DOCUMENTS ENDPOINTS ====================
export const DocumentAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/documents', { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  upload: async (documentData) => {
    try {
      const formData = new FormData();
      Object.keys(documentData).forEach((key) => {
        formData.append(key, documentData[key]);
      });
      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== ADMIN ENDPOINTS ====================
export const AdminAPI = {
  getUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getSystemStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== BOM ENDPOINTS ====================
export const BomAPI = {
  getByProductId: async (productId) => {
    try {
      const response = await axiosInstance.get(`/bom/product/${productId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (bomData) => {
    try {
      const response = await axiosInstance.post('/bom', bomData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, bomData) => {
    try {
      const response = await axiosInstance.put(`/bom/${id}`, bomData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/bom/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ==================== DASHBOARD ENDPOINTS ====================
export const DashboardAPI = {
  getMetrics: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getRecentActivities: async (limit = 10) => {
    try {
      const response = await axiosInstance.get('/dashboard/activities', { params: { limit } });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default {
  AuthAPI,
  ProductAPI,
  PartAPI,
  ChangeAPI,
  DocumentAPI,
  AdminAPI,
  BomAPI,
  DashboardAPI,
};
