/**
 * API Service
 * Centralized API client with interceptors and error handling
 */

import axios from 'axios';
import { API_CONFIG } from '../constants';
import { handleApiError } from '../utils/errorHandler';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth tokens
 */
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle errors consistently
    const appError = handleApiError(error, {
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(appError);
  }
);

/**
 * Jobs API endpoints
 */
export const jobsApi = {
  /**
   * Create a new analysis job
   */
  create: (data) => {
    return api.post('/api/v1/jobs/query', data);
  },

  /**
   * Get job status
   */
  getStatus: (jobId) => {
    return api.get(`/api/v1/jobs/${jobId}/status`);
  },

  /**
   * Get job results
   */
  getResults: (jobId) => {
    return api.get(`/api/v1/jobs/${jobId}/results`);
  },

  /**
   * Export job results
   */
  export: (jobId, options = {}) => {
    return api.post(`/api/v1/jobs/${jobId}/export`, options, {
      responseType: 'blob',
    });
  },

  /**
   * List all jobs
   */
  list: (params = {}) => {
    return api.get('/api/v1/jobs', { params });
  },

  /**
   * Delete a job
   */
  delete: (jobId) => {
    return api.delete(`/api/v1/jobs/${jobId}`);
  },
};

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login user
   */
  login: (credentials) => {
    return api.post('/api/v1/auth/login', credentials);
  },

  /**
   * Logout user
   */
  logout: () => {
    return api.post('/api/v1/auth/logout');
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return api.get('/api/v1/auth/me');
  },
};

/**
 * Health check endpoint
 */
export const healthApi = {
  check: () => {
    return api.get('/api/v1/health');
  },
};

export default api;
