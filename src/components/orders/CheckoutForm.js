import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';

const steps = ['Корзина', 'Доставка', 'Оплата', 'Подтверждение'];

const CheckoutForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress,
          paymentMethod,
          notes,
          totalAmount: total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch(clearCart());
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Товары в корзине
            </Typography>
            {items.map((item) => (
              <Box
                key={item._id}
                display="flex"
                alignItems="center"
                mb={2}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    marginRight: 16
                  }}
                />
                <Box flex={1}>
                  <Typography variant="subtitle1">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                Итого
              </Typography>
              <Typography variant="h6">
                {total.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Адрес доставки
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Улица"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Город"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Область"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Индекс"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Страна"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Способ оплаты
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Выберите способ оплаты</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Выберите способ оплаты"
              >
                <MenuItem value="credit_card">Кредитная карта</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="bank_transfer">Банковский перевод</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Примечания к заказу"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Подтверждение заказа
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Адрес доставки
              </Typography>
              <Typography variant="body2">
                {shippingAddress.street}, {shippingAddress.city},
                {shippingAddress.state}, {shippingAddress.zipCode},
                {shippingAddress.country}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Способ оплаты
              </Typography>
              <Typography variant="body2">
                {paymentMethod === 'credit_card' && 'Кредитная карта'}
                {paymentMethod === 'paypal' && 'PayPal'}
                {paymentMethod === 'bank_transfer' && 'Банковский перевод'}
              </Typography>
            </Paper>
            {notes && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Примечания
                </Typography>
                <Typography variant="body2">
                  {notes}
                </Typography>
              </Paper>
            )}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Итого к оплате
              </Typography>
              <Typography variant="h6">
                {total.toLocaleString('ru-RU')} ₽
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        Для оформления заказа необходимо войти в систему
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Ваша корзина пуста
      </Alert>
    );
  }

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Назад
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Оформить заказ'
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 1 && Object.values(shippingAddress).some(value => !value)) ||
              (activeStep === 2 && !paymentMethod)
            }
          >
            Далее
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CheckoutForm; 