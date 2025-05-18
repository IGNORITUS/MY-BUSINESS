import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  CircularProgress,
  useTheme,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../hooks/useNotification';
import {
  fetchDeliveryMethods,
  calculateDeliveryCost,
  setSelectedMethod,
} from '../redux/slices/deliverySlice';
import type { DeliveryMethod } from '../redux/slices/deliverySlice';
import { LocalShipping, Store } from '@mui/icons-material';

const MethodCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const MethodIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  borderRadius: '50%',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
}));

interface DeliveryMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  value,
  onChange
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const notification = useNotification();
  const { methods, loading, error, selectedMethod } = useSelector((state: any) => state.delivery);

  useEffect(() => {
    dispatch(fetchDeliveryMethods());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      notification.error(error);
    }
  }, [error, notification]);

  const handleMethodSelect = async (method: DeliveryMethod) => {
    try {
      const result = await dispatch(
        calculateDeliveryCost({ methodId: method.id, address })
      ).unwrap();

      dispatch(setSelectedMethod({ ...method, price: result.cost }));
      onChange(method.id);
    } catch (err) {
      notification.error('Ошибка при расчете стоимости доставки');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Способ доставки
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              border: value === 'delivery' ? '2px solid' : '1px solid',
              borderColor: value === 'delivery' ? 'primary.main' : 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main'
              }
            }}
            onClick={() => onChange('delivery')}
          >
            <FormControlLabel
              value="delivery"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle1">Доставка курьером</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Доставка до двери в течение 1-3 дней
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 2,
              border: value === 'pickup' ? '2px solid' : '1px solid',
              borderColor: value === 'pickup' ? 'primary.main' : 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main'
              }
            }}
            onClick={() => onChange('pickup')}
          >
            <FormControlLabel
              value="pickup"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Store sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle1">Самовывоз</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Бесплатно из ближайшего магазина
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default DeliveryMethodSelector; 