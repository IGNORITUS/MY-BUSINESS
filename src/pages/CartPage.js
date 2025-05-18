import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import ValidationError from '../components/common/ValidationError';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error, totalItems, totalPrice } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <ValidationError error={error} />
      </Container>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container>
        <Box textAlign="center" py={8}>
          <Typography variant="h5" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Перейти к товарам
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>

      <Grid container spacing={3}>
        {/* Список товаров */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <img
                    src={item.изображение}
                    alt={item.название}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">
                    {item.название}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(item.цена)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.количество, -1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>
                      {item.количество}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.количество, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            variant="outlined"
            color="error"
            onClick={handleClearCart}
            sx={{ mt: 2 }}
          >
            Очистить корзину
          </Button>
        </Grid>

        {/* Итого */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Итого
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Количество товаров: {totalItems}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {formatPrice(totalPrice)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
            >
              Оформить заказ
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage; 