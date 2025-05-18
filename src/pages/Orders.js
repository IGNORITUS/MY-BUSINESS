import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import { fetchUserOrders } from '../redux/slices/ordersSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Orders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Мои заказы
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {orders.length === 0 ? (
          <Typography>У вас пока нет заказов.</Typography>
        ) : (
          <Grid container spacing={2}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} key={order._id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">
                    Заказ №{order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Дата: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Сумма: {order.totalPrice} ₽
                  </Typography>
                  <Typography variant="body2">
                    Статус: {order.status}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => window.location.href = `/orders/${order._id}`}
                  >
                    Подробнее
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Orders; 