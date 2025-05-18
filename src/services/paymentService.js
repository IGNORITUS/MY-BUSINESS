import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createPayment = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при создании платежа');
  }
};

export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при проверке статуса платежа');
  }
}; 