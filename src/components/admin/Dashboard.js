import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Category as ProductsIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2
          }}
        >
          {React.cloneElement(icon, { sx: { color } })}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
    salesByCategory: []
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        Обзор
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Статистика */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Заказы"
            value={stats.totalOrders}
            icon={<OrdersIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Доход"
            value={`${stats.totalRevenue.toLocaleString('ru-RU')} ₽`}
            icon={<RevenueIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Пользователи"
            value={stats.totalUsers}
            icon={<UsersIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Товары"
            value={stats.totalProducts}
            icon={<ProductsIcon />}
            color="#9c27b0"
          />
        </Grid>

        {/* Последние заказы */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Последние заказы
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentOrders.map((order) => (
              <Box key={order._id} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">
                    Заказ #{order._id.slice(-6)}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {order.totalAmount.toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Популярные товары */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Популярные товары
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.topProducts.map((product) => (
              <Box key={product._id} mb={2}>
                <Box display="flex" alignItems="center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'cover',
                      marginRight: 8
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="subtitle1">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Продано: {product.totalSold} шт.
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" color="primary">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Продажи по категориям */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Продажи по категориям
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {stats.salesByCategory.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.name}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: 'background.default',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {category.revenue.toLocaleString('ru-RU')} ₽
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.orders} заказов
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 