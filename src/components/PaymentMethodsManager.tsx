import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';
import {
  fetchPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from '../redux/slices/paymentMethodsSlice';
import { RootState } from '../redux/store';
import PaymentForm from './PaymentForm';

const PaymentMethodsManager: React.FC = () => {
  const dispatch = useDispatch();
  const { methods, loading, error } = useSelector((state: RootState) => state.paymentMethods);
  const { success, error: showError } = useNotification();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleAddMethod = async (methodData: any) => {
    try {
      await dispatch(addPaymentMethod(methodData)).unwrap();
      success('Платежный метод успешно добавлен');
      setIsAddDialogOpen(false);
    } catch (error) {
      showError('Ошибка при добавлении платежного метода');
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    try {
      await dispatch(removePaymentMethod(methodId)).unwrap();
      success('Платежный метод успешно удален');
    } catch (error) {
      showError('Ошибка при удалении платежного метода');
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await dispatch(setDefaultPaymentMethod(methodId)).unwrap();
      success('Метод по умолчанию обновлен');
    } catch (error) {
      showError('Ошибка при обновлении метода по умолчанию');
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return 'G';
      default:
        return '💳';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Платежные методы</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Добавить метод
        </Button>
      </Box>

      <Grid container spacing={2}>
        <AnimatePresence>
          {methods.map((method) => (
            <Grid item xs={12} sm={6} md={4} key={method.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" mr={1}>
                          {getMethodIcon(method.type)}
                        </Typography>
                        <Box>
                          <Typography variant="subtitle1">{method.name}</Typography>
                          {method.last4 && (
                            <Typography variant="body2" color="text.secondary">
                              **** **** **** {method.last4}
                            </Typography>
                          )}
                          {method.expiryDate && (
                            <Typography variant="body2" color="text.secondary">
                              Срок действия: {method.expiryDate}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleSetDefault(method.id)}
                          color={method.isDefault ? 'primary' : 'default'}
                        >
                          {method.isDefault ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                        <IconButton
                          onClick={() => handleRemoveMethod(method.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить платежный метод</DialogTitle>
        <DialogContent>
          <PaymentForm onSubmit={handleAddMethod} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentMethodsManager; 