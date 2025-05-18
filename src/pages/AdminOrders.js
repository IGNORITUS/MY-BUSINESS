import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Pagination from '../components/Pagination';

const orderStatuses = {
  pending: { label: 'Ожидает оплаты', color: 'warning' },
  processing: { label: 'В обработке', color: 'info' },
  shipped: { label: 'Отправлен', color: 'primary' },
  delivered: { label: 'Доставлен', color: 'success' },
  cancelled: { label: 'Отменен', color: 'error' },
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      setSelectedOrder(null);
    } catch {}
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => dispatch(fetchOrders())} />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Управление заказами
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Поиск заказов"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                label="Статус"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Все статусы</MenuItem>
                {Object.entries(orderStatuses).map(([value, { label }]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID заказа</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.total} ₽</TableCell>
                <TableCell>
                  <Chip
                    label={orderStatuses[order.status].label}
                    color={orderStatuses[order.status].color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setSelectedOrder(order)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredOrders.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>Детали заказа #{selectedOrder.id}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Информация о заказе
                  </Typography>
                  <Typography variant="body2">
                    Дата: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Пользователь: {selectedOrder.user.email}
                  </Typography>
                  <Typography variant="body2">
                    Сумма: {selectedOrder.total} ₽
                  </Typography>
                  <Typography variant="body2">
                    Способ оплаты: {selectedOrder.paymentMethod}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Товары
                  </Typography>
                  {selectedOrder.items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', mb: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.product.name} x {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        {item.price * item.quantity} ₽
                      </Typography>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Адрес доставки
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Статус заказа</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      label="Статус заказа"
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    >
                      {Object.entries(orderStatuses).map(([value, { label }]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminOrders; 