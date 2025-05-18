import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from '../redux/slices/cartSlice';
import { RootState } from '../redux/store';
import { Product } from '../types/product';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      dispatch(updateCartItemQuantity({ product, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (product: Product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {t('cartEmpty')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            {t('continueShopping')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">{t('shoppingCart')}</Typography>
              <Button
                color="error"
                onClick={handleClearCart}
                startIcon={<DeleteIcon />}
              >
                {t('clearCart')}
              </Button>
            </Box>

            {items.map((item) => (
              <React.Fragment key={item.product._id}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <CardMedia
                          component="img"
                          image={item.product.images[0]}
                          alt={item.product.name}
                          sx={{ height: 100, objectFit: 'contain' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('price')}: ${item.product.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          type="number"
                          label={t('quantity')}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product,
                              parseInt(e.target.value)
                            )
                          }
                          inputProps={{ min: 1, max: item.product.stock }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.product)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </React.Fragment>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('orderSummary')}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>{t('subtotal')}</Typography>
                </Grid>
                <Grid item>
                  <Typography>${total.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>{t('shipping')}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{t('calculatedAtCheckout')}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography variant="h6">{t('total')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              {t('proceedToCheckout')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/products')}
              sx={{ mt: 2 }}
            >
              {t('continueShopping')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 