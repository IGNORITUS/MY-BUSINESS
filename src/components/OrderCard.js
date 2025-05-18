import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Ожидает оплаты';
    case 'processing':
      return 'В обработке';
    case 'shipped':
      return 'Отправлен';
    case 'delivered':
      return 'Доставлен';
    case 'cancelled':
      return 'Отменен';
    default:
      return status;
  }
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Заказ #{order.id}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(order.createdAt).toLocaleDateString('ru-RU')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {order.paymentMethod}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Chip
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
                sx={{ mb: 1 }}
              />
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {order.total.toLocaleString('ru-RU')} ₽
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClick}
              >
                Подробнее
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderCard; 