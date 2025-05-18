import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../services/paymentService';
import { formatPrice } from '../utils/format';

const PaymentForm = ({ order, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentData = {
        orderId: order._id,
        amount: order.totalAmount,
        description: `Заказ №${order._id}`,
        returnUrl: `${window.location.origin}/orders/${order._id}`
      };

      const { confirmationUrl } = await createPayment(paymentData);
      
      // Перенаправляем на страницу оплаты
      window.location.href = confirmationUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Оплата заказа
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Сумма к оплате:
        </Typography>
        <Typography variant="h5" color="primary">
          {formatPrice(order.totalAmount)}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={loading}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Оплатить'
          )}
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate(`/orders/${order._id}`)}
          fullWidth
        >
          Отмена
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        После нажатия кнопки "Оплатить" вы будете перенаправлены на страницу оплаты ЮKassa.
        Пожалуйста, не закрывайте окно браузера до завершения оплаты.
      </Typography>
    </Paper>
  );
};

export default PaymentForm; 