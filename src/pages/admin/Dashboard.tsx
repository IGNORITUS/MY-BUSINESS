import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  LocalShipping as DeliveryIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Star as ReviewsIcon,
  LocalOffer as PromotionsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { title: 'Всего заказов', value: '1,234', icon: <OrdersIcon />, color: '#1976d2' },
    { title: 'Товары', value: '567', icon: <ProductsIcon />, color: '#2e7d32' },
    { title: 'Пользователи', value: '890', icon: <UsersIcon />, color: '#ed6c02' },
    { title: 'Доход', value: '₽123,456', icon: <AnalyticsIcon />, color: '#9c27b0' },
  ];

  const menuItems = [
    { text: 'Обзор', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Заказы', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Товары', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'Пользователи', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Доставка', icon: <DeliveryIcon />, path: '/admin/delivery' },
    { text: 'Аналитика', icon: <AnalyticsIcon />, path: '/admin/analytics' },
    { text: 'Отзывы', icon: <ReviewsIcon />, path: '/admin/reviews' },
    { text: 'Акции', icon: <PromotionsIcon />, path: '/admin/promotions' },
    { text: 'Настройки', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Админ панель
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" component="h1">
            Обзор
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography color="textSecondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h5" component="div">
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: `${stat.color}15`,
                          borderRadius: '50%',
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {React.cloneElement(stat.icon, {
                          sx: { color: stat.color, fontSize: 30 },
                        })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Последние заказы
              </Typography>
              {/* Здесь будет компонент с таблицей заказов */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Популярные товары
              </Typography>
              {/* Здесь будет компонент со списком популярных товаров */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 