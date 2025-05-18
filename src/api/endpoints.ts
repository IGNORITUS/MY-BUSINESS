import axiosInstance from './axios';

// Аутентификация
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    axiosInstance.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    axiosInstance.post('/auth/register', userData),
  
  forgotPassword: (email: string) =>
    axiosInstance.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { token: string; password: string }) =>
    axiosInstance.post('/auth/reset-password', data),
};

// Товары
export const productsAPI = {
  getAll: (params?: { category?: string; minPrice?: number; maxPrice?: number; sortBy?: string }) =>
    axiosInstance.get('/products', { params }),
  
  getById: (id: string) =>
    axiosInstance.get(`/products/${id}`),
  
  create: (productData: FormData) =>
    axiosInstance.post('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, productData: FormData) =>
    axiosInstance.put(`/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) =>
    axiosInstance.delete(`/products/${id}`),
};

// Категории
export const categoriesAPI = {
  getAll: () =>
    axiosInstance.get('/categories'),
  
  getById: (id: string) =>
    axiosInstance.get(`/categories/${id}`),
  
  create: (categoryData: FormData) =>
    axiosInstance.post('/categories', categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, categoryData: FormData) =>
    axiosInstance.put(`/categories/${id}`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) =>
    axiosInstance.delete(`/categories/${id}`),
};

// Заказы
export const ordersAPI = {
  getAll: () =>
    axiosInstance.get('/orders'),
  
  getById: (id: string) =>
    axiosInstance.get(`/orders/${id}`),
  
  create: (orderData: any) =>
    axiosInstance.post('/orders', orderData),
  
  updateStatus: (id: string, status: string) =>
    axiosInstance.patch(`/orders/${id}/status`, { status }),
};

// Пользователи
export const usersAPI = {
  getProfile: () =>
    axiosInstance.get('/users/profile'),
  
  updateProfile: (userData: any) =>
    axiosInstance.put('/users/profile', userData),
  
  updatePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put('/users/password', passwordData),
};

// Избранное
export const favoritesAPI = {
  getAll: () =>
    axiosInstance.get('/favorites'),
  
  add: (productId: string) =>
    axiosInstance.post('/favorites', { productId }),
  
  remove: (productId: string) =>
    axiosInstance.delete(`/favorites/${productId}`),
}; 