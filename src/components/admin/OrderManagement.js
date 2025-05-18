import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/orders?page=${page + 1}&limit=${rowsPerPage}${statusFilter ? `&status=${statusFilter}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders);
      setTotalOrders(data.totalOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса заказа');
      }

      setStatusDialogOpen(false);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShippingUpdate = async () => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'shipped',
          trackingNumber,
          estimatedDelivery
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении информации о доставке');
      }

      setShippingDialogOpen(false);
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

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Управление заказами
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фильтр по статусу</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Фильтр по статусу"
          >
            <MenuItem value="">Все заказы</MenuItem>
            <MenuItem value="pending">Ожидает обработки</MenuItem>
            <MenuItem value="processing">В обработке</MenuItem>
            <MenuItem value="shipped">Отправлен</MenuItem>
            <MenuItem value="delivered">Доставлен</MenuItem>
            <MenuItem value="cancelled">Отменен</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID заказа</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Клиент</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id.slice(-6)}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ru })}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => setSelectedOrder(order)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <IconButton
                      onClick={() => {
                        setSelectedOrder(order);
                        setStatusDialogOpen(true);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {order.status === 'processing' && (
                    <IconButton
                      onClick={() => {
                        setSelectedOrder(order);
                        setShippingDialogOpen(true);
                      }}
                      color="primary"
                    >
                      <ShippingIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalOrders}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />
      </TableContainer>

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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Информация о клиенте
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.user.name}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.user.email}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Адрес доставки
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},
                    {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipCode},
                    {selectedOrder.shippingAddress.country}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
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
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Способ оплаты
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.paymentMethod === 'credit_card' && 'Кредитная карта'}
                    {selectedOrder.paymentMethod === 'paypal' && 'PayPal'}
                    {selectedOrder.paymentMethod === 'bank_transfer' && 'Банковский перевод'}
                  </Typography>
                </Grid>

                {selectedOrder.trackingNumber && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Информация о доставке
                    </Typography>
                    <Typography variant="body2">
                      Трек-номер: {selectedOrder.trackingNumber}
                    </Typography>
                    {selectedOrder.estimatedDelivery && (
                      <Typography variant="body2">
                        Предполагаемая дата доставки: {format(new Date(selectedOrder.estimatedDelivery), 'd MMMM yyyy', { locale: ru })}
                      </Typography>
                    )}
                  </Grid>
                )}

                {selectedOrder.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Примечания
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.notes}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      Итого
                    </Typography>
                    <Typography variant="h6">
                      {selectedOrder.totalAmount.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Диалог изменения статуса */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>
          Изменить статус заказа
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="info"
              onClick={() => handleStatusChange('processing')}
              sx={{ mb: 1 }}
            >
              В обработку
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange('shipped')}
              sx={{ mb: 1 }}
            >
              Отправлен
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="success"
              onClick={() => handleStatusChange('delivered')}
              sx={{ mb: 1 }}
            >
              Доставлен
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => handleStatusChange('cancelled')}
            >
              Отменить
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Отмена
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог обновления информации о доставке */}
      <Dialog
        open={shippingDialogOpen}
        onClose={() => setShippingDialogOpen(false)}
      >
        <DialogTitle>
          Информация о доставке
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Трек-номер"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Предполагаемая дата доставки"
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShippingDialogOpen(false)}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleShippingUpdate}
            disabled={!trackingNumber || !estimatedDelivery}
          >
            Обновить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement; 