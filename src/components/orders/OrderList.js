import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/user?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при отмене заказа');
      }

      setCancelDialogOpen(false);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

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
        return 'Ожидает обработки';
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Мои заказы
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          У вас пока нет заказов
        </Typography>
      ) : (
        <>
          {orders.map((order) => (
            <Card key={order._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      Заказ #{order._id.slice(-6)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ru })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="h6" component="span">
                      {order.totalAmount.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">
                        {order.items.length} товаров
                      </Typography>
                      <Box>
                        <IconButton
                          onClick={() => handleViewOrder(order)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {order.status === 'pending' && (
                          <IconButton
                            onClick={() => {
                              setSelectedOrder(order);
                              setCancelDialogOpen(true);
                            }}
                            color="error"
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ mr: 1 }}
              >
                Назад
              </Button>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Страница {page} из {totalPages}
              </Typography>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{ ml: 1 }}
              >
                Вперед
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Диалог просмотра заказа */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Заказ #{selectedOrder._id.slice(-6)}
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Статус заказа
                </Typography>
                <Chip
                  label={getStatusText(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Адрес доставки
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},
                  {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipCode},
                  {selectedOrder.shippingAddress.country}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Товары
                </Typography>
                {selectedOrder.items.map((item) => (
                  <Box
                    key={item._id}
                    display="flex"
                    alignItems="center"
                    mb={1}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        marginRight: 8
                      }}
                    />
                    <Box flex={1}>
                      <Typography variant="body2">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2">
                      {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Способ оплаты
                </Typography>
                <Typography variant="body2">
                  {selectedOrder.paymentMethod === 'credit_card' && 'Кредитная карта'}
                  {selectedOrder.paymentMethod === 'paypal' && 'PayPal'}
                  {selectedOrder.paymentMethod === 'bank_transfer' && 'Банковский перевод'}
                </Typography>
              </Box>

              {selectedOrder.notes && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Примечания
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.notes}
                  </Typography>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">
                  Итого
                </Typography>
                <Typography variant="h6">
                  {selectedOrder.totalAmount.toLocaleString('ru-RU')} ₽
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Диалог подтверждения отмены заказа */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>
          Отменить заказ?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите отменить заказ #{selectedOrder?._id.slice(-6)}?
            Это действие нельзя будет отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Нет
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
          >
            Да, отменить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderList; 