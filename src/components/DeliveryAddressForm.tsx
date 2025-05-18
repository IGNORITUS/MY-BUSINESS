import React, { useState } from 'react';
import {
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Autocomplete,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';
import type { DeliveryAddress } from '../redux/slices/deliverySlice';

const AddressForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

interface DeliveryAddressFormProps {
  onAddressChange: (address: DeliveryAddress) => void;
  initialAddress?: DeliveryAddress;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  onAddressChange,
  initialAddress,
}) => {
  const theme = useTheme();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress>(
    initialAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Россия',
    }
  );

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onAddressChange(newAddress);

    // Здесь можно добавить логику для получения подсказок адреса
    if (field === 'street' && value.length > 3) {
      // Имитация загрузки подсказок
      setLoading(true);
      setTimeout(() => {
        setSuggestions([
          `${value} ул.`,
          `${value} проспект`,
          `${value} переулок`,
        ]);
        setLoading(false);
      }, 500);
    }
  };

  const validateZipCode = (zipCode: string) => {
    const zipRegex = /^\d{6}$/;
    return zipRegex.test(zipCode);
  };

  const handleZipCodeChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      handleAddressChange('zipCode', value);
      if (value.length === 6 && !validateZipCode(value)) {
        notification.warning('Введите корректный почтовый индекс');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AddressForm>
        <Typography variant="h6" gutterBottom>
          Адрес доставки
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={suggestions}
              loading={loading}
              value={address.street}
              onChange={(_, newValue) => {
                handleAddressChange('street', newValue || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  label="Улица"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Город"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Область/Регион"
              value={address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Почтовый индекс"
              value={address.zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              error={address.zipCode.length === 6 && !validateZipCode(address.zipCode)}
              helperText={
                address.zipCode.length === 6 && !validateZipCode(address.zipCode)
                  ? 'Введите корректный почтовый индекс'
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Страна"
              value={address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
            />
          </Grid>
        </Grid>
      </AddressForm>
    </motion.div>
  );
};

export default DeliveryAddressForm; 