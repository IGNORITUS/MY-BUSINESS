import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data === null || config.data === undefined) {
      config.data = {};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token } = response.data;
          
          if (localStorage.getItem('rememberMe') === 'true') {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }

      store.dispatch(logout());
      window.location.href = '/auth';
    }

    // Handle validation errors
    if (error.response?.data?.errors) {
      return Promise.reject(error.response.data.errors);
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred while processing your request';
    return Promise.reject({
      ...error,
      message: errorMessage,
      response: {
        ...error.response,
        data: {
          ...error.response?.data,
          message: errorMessage
        }
      }
    });
  }
);

export default axiosInstance; 