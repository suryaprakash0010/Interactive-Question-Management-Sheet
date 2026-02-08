import axios from 'axios';

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token here if implementing authentication
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Forbidden access');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

// Utility functions for API calls
export const apiUtils = {
  // Simulate network delay for development
  delay: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Handle API errors consistently
  handleError: (error, defaultMessage = 'An error occurred') => {
    const message = error.response?.data?.error || error.message || defaultMessage;
    console.error('API Error:', error);
    return message;
  },
  
  // Retry failed requests
  retry: async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiUtils.retry(fn, retries - 1, delay * 2);
    }
  }
};

export default api;
