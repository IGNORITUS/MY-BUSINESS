import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { createPaymentIntent, resetPaymentState } from '../redux/slices/paymentSlice';
import PaymentGateway from '../components/PaymentGateway';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Инициализация Stripe с тестовым ключом
const stripePromise = loadStripe('pk_test_51Nk9YwKZvIlo7VxXKZvIlo7VxXKZvIlo7VxXKZvIlo7VxXKZvIlo7VxX');

const steps = ['Корзина', 'Доставка', 'Оплата', 'Подтверждение'];

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const paymentState = useSelector((state) => state.payment);

  const [activeStep, setActiveStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    comment: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return cartItems.length > 0;
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          (deliveryMethod === 'pickup' ||
            (formData.address && formData.city && formData.zipCode))
        );
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      setError('Пожалуйста, заполните все обязательные поля');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      handleSubmit();
    } catch (err) {
      setError('Ошибка при обработке платежа');
    }
  };

  const handlePaymentError = (error) => {
    setError(error);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cartItems,
        delivery: {
          method: deliveryMethod,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        payment: {
          method: paymentMethod,
          paymentIntentId: paymentState.clientSecret,
        },
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        comment: formData.comment,
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      dispatch(resetPaymentState());
      navigate('/order-success');
    } catch (err) {
      setError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'courier' ? (subtotal > 5000 ? 0 : 500) : 0;
  const total = subtotal + deliveryCost;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Товары в корзине
              </Typography>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box
                        component="img"
                        src={item.images[0]}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: 80,
                          objectFit: 'contain',
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × {item.price.toLocaleString('ru-RU')} ₽
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Итого: {total.toLocaleString('ru-RU')} ₽
                </Typography>
              </Box>
            </Box>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Способ доставки
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="courier"
                    control={<Radio />}
                    label="Курьерская доставка"
                  />
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label="Самовывоз"
                  />
                </RadioGroup>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Имя"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Фамилия"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                {deliveryMethod === 'courier' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Адрес"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Город"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Индекс"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Комментарий к заказу"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Способ оплаты
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Банковской картой"
                  />
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Наличными при получении"
                  />
                </RadioGroup>
              </FormControl>

              {paymentMethod === 'card' && (
                <Elements stripe={stripePromise}>
                  <PaymentGateway
                    amount={total}
                    currency="₽"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}

              {paymentMethod === 'cash' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Оплата производится при получении заказа. Подготовьте точную сумму.
                </Alert>
              )}
            </Box>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Подтверждение заказа
              </Typography>
              <Typography paragraph>
                Пожалуйста, проверьте все данные перед подтверждением заказа.
              </Typography>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Данные для доставки
                  </Typography>
                  <Typography>
                    {formData.firstName} {formData.lastName}
                  </Typography>
                  <Typography>{formData.email}</Typography>
                  <Typography>{formData.phone}</Typography>
                  {deliveryMethod === 'courier' && (
                    <>
                      <Typography>{formData.address}</Typography>
                      <Typography>
                        {formData.city}, {formData.zipCode}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Итого к оплате
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {total.toLocaleString('ru-RU')} ₽
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Оформление заказа
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || isSubmitting}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isSubmitting}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: theme.palette.common.white,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Подтвердить заказ'
            ) : (
              'Далее'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 