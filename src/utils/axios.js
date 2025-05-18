import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик ответов для обработки ошибок
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Ошибка от сервера
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Ошибка сети
      return Promise.reject(new Error('Нет соединения с сервером'));
    } else {
      // Ошибка при настройке запроса
      return Promise.reject(error);
    }
  }
);

export default instance; 