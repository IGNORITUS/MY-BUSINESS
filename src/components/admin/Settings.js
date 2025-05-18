import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Основная информация
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    
    // Настройки доставки
    deliveryEnabled: true,
    freeDeliveryThreshold: 0,
    deliveryCost: 0,
    deliveryTime: '',
    
    // Настройки оплаты
    paymentMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: true
    },
    
    // Настройки уведомлений
    notifications: {
      newOrder: true,
      orderStatus: true,
      lowStock: true
    }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: checked !== undefined ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Настройки магазина
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Настройки успешно сохранены
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Основная информация */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Название магазина"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Адрес"
                    name="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Описание магазина"
                    name="storeDescription"
                    value={settings.storeDescription}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Настройки доставки */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Настройки доставки
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.deliveryEnabled}
                        onChange={handleInputChange}
                        name="deliveryEnabled"
                      />
                    }
                    label="Включить доставку"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Стоимость доставки"
                    name="deliveryCost"
                    type="number"
                    value={settings.deliveryCost}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">₽</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Бесплатная доставка от"
                    name="freeDeliveryThreshold"
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">₽</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Срок доставки"
                    name="deliveryTime"
                    value={settings.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="Например: 2-3 дня"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Способы оплаты */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Способы оплаты
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentMethods.creditCard}
                        onChange={handleInputChange}
                        name="paymentMethods.creditCard"
                      />
                    }
                    label="Банковская карта"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentMethods.paypal}
                        onChange={handleInputChange}
                        name="paymentMethods.paypal"
                      />
                    }
                    label="PayPal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.paymentMethods.bankTransfer}
                        onChange={handleInputChange}
                        name="paymentMethods.bankTransfer"
                      />
                    }
                    label="Банковский перевод"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Уведомления */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Уведомления
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.newOrder}
                        onChange={handleInputChange}
                        name="notifications.newOrder"
                      />
                    }
                    label="Новые заказы"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.orderStatus}
                        onChange={handleInputChange}
                        name="notifications.orderStatus"
                      />
                    }
                    label="Изменение статуса заказа"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.lowStock}
                        onChange={handleInputChange}
                        name="notifications.lowStock"
                      />
                    }
                    label="Низкий запас товаров"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Кнопка сохранения */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить настройки'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Settings; 