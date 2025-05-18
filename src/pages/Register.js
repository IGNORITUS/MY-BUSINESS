import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link
} from '@mui/material';
import { register } from '../store/slices/authSlice';
import { validateRegistration } from '../utils/validation';
import ValidationError from '../components/common/ValidationError';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    имя: '',
    email: '',
    пароль: '',
    подтверждение_пароля: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Валидация формы
    const validationErrors = validateRegistration(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/');
    } catch (error) {
      setServerError(error.message || 'Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Регистрация
        </Typography>

        {serverError && <ValidationError error={serverError} />}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Имя"
            name="имя"
            value={formData.имя}
            onChange={handleChange}
            error={!!errors.имя}
            helperText={errors.имя}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Пароль"
            name="пароль"
            type="password"
            value={formData.пароль}
            onChange={handleChange}
            error={!!errors.пароль}
            helperText={errors.пароль}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Подтверждение пароля"
            name="подтверждение_пароля"
            type="password"
            value={formData.подтверждение_пароля}
            onChange={handleChange}
            error={!!errors.подтверждение_пароля}
            helperText={errors.подтверждение_пароля}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зарегистрироваться
          </Button>

          <Box textAlign="center">
            <Link href="/login" variant="body2">
              Уже есть аккаунт? Войти
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 