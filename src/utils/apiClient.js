import axios from 'axios';
import { getAuthToken, clearUserData } from '@/services/userService';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Include cookies for httpOnly tokens
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add a flag to identify if this request needs authentication
    if (!token && config.url !== '/api/auth/login') {
      config._needsAuth = true;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication error detected, clearing user data');
      clearUserData();
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const apiGet = (url, config = {}) => {
  return apiClient.get(url, config);
};

export const apiPost = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};

export const apiPut = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};

export const apiDelete = (url, config = {}) => {
  return apiClient.delete(url, config);
};

export default apiClient; 