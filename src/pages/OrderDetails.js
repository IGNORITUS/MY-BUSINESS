import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import { fetchOrderById } from '../redux/slices/ordersSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const statusColors = {
  pending: 'warning',
  paid: 'success',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!order) return <Error message="Заказ не найден" />;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
          Назад
        </Button>
        <Typography variant="h4" gutterBottom>
          Заказ №{order._id}
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Дата заказа:</Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">Статус:</Typography>
              <Chip
                label={order.status}
                color={statusColors[order.status] || 'default'}
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1">Сумма заказа:</Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {order.totalPrice} ₽
              </Typography>
              <Typography variant="subtitle1">Способ оплаты:</Typography>
              <Typography variant="body1" gutterBottom>
                {order.paymentMethod === 'card' ? 'Банковской картой' : 'Наличными при получении'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Доставка:</Typography>
              <Typography variant="body1">
                {order.deliveryMethod === 'courier' ? 'Курьерская доставка' : 'Самовывоз'}
              </Typography>
              {order.deliveryMethod === 'courier' && (
                <>
                  <Typography variant="body2">Город: {order.city}</Typography>
                  <Typography variant="body2">Адрес: {order.address}</Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h5" gutterBottom>
          Состав заказа
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {order.items.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    component="img"
                    src={item.images?.[0]}
                    alt={item.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price} ₽ x {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    {item.price * item.quantity} ₽
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderDetails; 