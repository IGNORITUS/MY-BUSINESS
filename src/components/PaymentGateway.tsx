import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';
import { createPaymentIntent } from '../redux/slices/paymentSlice';
import { fetchPaymentMethods } from '../redux/slices/paymentMethodsSlice';
import { RootState } from '../redux/store';
import PaymentForm from './PaymentForm';

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const dispatch = useDispatch();
  const { success, error: showError } = useNotification();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { methods, loading: methodsLoading } = useSelector(
    (state: RootState) => state.paymentMethods
  );
  const { loading: paymentLoading, error: paymentError } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const selectedPaymentMethod = methods.find(m => m.id === selectedMethod);
      
      if (!selectedPaymentMethod) {
        throw new Error('Платежный метод не выбран');
      }

      const response = await dispatch(createPaymentIntent({
        amount,
        currency,
        paymentMethodId: selectedMethod,
      })).unwrap();

      onSuccess(response.paymentId);
      success('Оплата успешно выполнена');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при обработке платежа';
      onError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (methodsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {paymentError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {paymentError}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Сумма к оплате
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          {amount} {currency}
        </Typography>
      </Paper>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
        <FormLabel component="legend">Выберите способ оплаты</FormLabel>
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          <Grid container spacing={2}>
            {methods.map((method) => (
              <Grid item xs={12} sm={6} key={method.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedMethod === method.id ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                    }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">
                            {method.name}
                          </Typography>
                          {method.last4 && (
                            <Typography variant="body2" color="text.secondary">
                              **** **** **** {method.last4}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>

      {!selectedMethod && methods.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          У вас нет сохраненных платежных методов. Пожалуйста, добавьте новый метод оплаты.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing || paymentLoading}
        sx={{ mt: 2 }}
      >
        {isProcessing || paymentLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Оплатить'
        )}
      </Button>
    </Box>
  );
};

export default PaymentGateway; 