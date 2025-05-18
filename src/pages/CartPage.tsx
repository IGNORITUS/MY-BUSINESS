import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const CartItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const CartSummary = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const CartPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:5000/api/cart/${itemId}`, {
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders');
      navigate(`/order/${response.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography>Загрузка корзины...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 4,
          }}
        >
          Корзина
        </Typography>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: 64,
                color: 'text.secondary',
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ваша корзина пуста
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/catalog')}
              sx={{ mt: 2 }}
            >
              Перейти в каталог
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'contain',
                      mr: 2,
                    }}
                    image={item.image}
                    alt={item.name}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ mb: 2 }}
                    >
                      {item.price.toLocaleString()} ₽
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(item.id, value);
                            }
                          }}
                          type="number"
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center', width: 40 },
                          }}
                          variant="standard"
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CartItem>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <CartSummary>
                <Typography variant="h6" gutterBottom>
                  Итого
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">Подытог</Typography>
                    <Typography>{subtotal.toLocaleString()} ₽</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">Доставка</Typography>
                    <Typography>{shipping.toLocaleString()} ₽</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Итого</Typography>
                    <Typography variant="h6" color="primary">
                      {total.toLocaleString()} ₽
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </Button>
                </Box>
              </CartSummary>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CartPage; 