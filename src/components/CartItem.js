import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 150,
                objectFit: 'contain',
                cursor: 'pointer',
              }}
              onClick={handleClick}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: 'pointer' }}
              onClick={handleClick}
            >
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                type="number"
                size="small"
                sx={{ width: 60, mx: 1 }}
                inputProps={{ min: 1, max: item.stock }}
              />
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {item.price.toLocaleString('ru-RU')} ₽
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Итого: {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemove}
                size="small"
              >
                Удалить
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CartItem; 