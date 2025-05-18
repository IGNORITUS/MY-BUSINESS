import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const ProfileSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
}));

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
    fetchFavorites();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/user/profile', userData);
      // Показать уведомление об успешном обновлении
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography>Загрузка...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ProfileSection
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <ProfileAvatar>
                  <PersonIcon sx={{ fontSize: 60 }} />
                </ProfileAvatar>
                <Typography variant="h5" gutterBottom>
                  {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                orientation="vertical"
                variant="fullWidth"
              >
                <Tab icon={<PersonIcon />} label="Личные данные" />
                <Tab icon={<ShoppingBagIcon />} label="История заказов" />
                <Tab icon={<FavoriteIcon />} label="Избранное" />
              </Tabs>
            </ProfileSection>
          </Grid>
          <Grid item xs={12} md={8}>
            <ProfileSection
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {activeTab === 0 && (
                <Box component="form" onSubmit={handleProfileUpdate}>
                  <Typography variant="h6" gutterBottom>
                    Редактировать профиль
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Имя"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Телефон"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Адрес"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Сохранить изменения
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    История заказов
                  </Typography>
                  {orders.length === 0 ? (
                    <Typography color="text.secondary">
                      У вас пока нет заказов
                    </Typography>
                  ) : (
                    <List>
                      {orders.map((order) => (
                        <React.Fragment key={order.id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <ShoppingBagIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`Заказ #${order.id}`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2">
                                    {new Date(order.date).toLocaleDateString()}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    Сумма: {order.total.toLocaleString()} ₽
                                  </Typography>
                                </>
                              }
                            />
                            <Chip
                              label={order.status}
                              color={
                                order.status === 'completed'
                                  ? 'success'
                                  : order.status === 'processing'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Избранные товары
                  </Typography>
                  {favorites.length === 0 ? (
                    <Typography color="text.secondary">
                      У вас пока нет избранных товаров
                    </Typography>
                  ) : (
                    <List>
                      {favorites.map((product) => (
                        <React.Fragment key={product.id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                variant="rounded"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={product.name}
                              secondary={`${product.price.toLocaleString()} ₽`}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              )}
            </ProfileSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 