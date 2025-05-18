import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Если есть сообщение об ошибке от сервера, используем его
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    
    // Если нет ответа от сервера
    if (!error.response) {
      return Promise.reject(new Error('Нет соединения с сервером'));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 