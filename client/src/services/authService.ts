import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Base URL for API requests
const API_URL = '/api';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    console.log('Attempting login with:', { username });
    const response = await api.post('/auth/login', { username, password });
    console.log('Login response:', response);
    
    if (!response.data || !response.data.token || !response.data.user) {
      throw new Error('Invalid response format from server');
    }
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data?.message || 'Login failed. Please try again.');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message || 'An error occurred during login.');
    }
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() < exp * 1000;
  } catch (error) {
    return false;
  }
};

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000, // 15 seconds
  responseType: 'json',
});

// In development, we'll rely on the Vite proxy to handle the SSL/TLS connection to the backend
// This avoids using Node.js-specific code in the browser

// Add request interceptor to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., token expired)
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
